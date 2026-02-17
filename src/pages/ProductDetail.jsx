import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Star, Minus, Plus, Check, Truck, Shield, RefreshCw, ImageIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getProduct, listReviews, createReview } from '@/api/api';

export default function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '' });

  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');

  useEffect(() => {
    const load = async () => {
      if (!productId) return;
      try {
        const foundProduct = await getProduct(productId);
        setProduct(foundProduct);
        const productReviews = await listReviews(productId);
        setReviews(Array.isArray(productReviews) ? productReviews : []);
      } catch (err) {
        toast.error(err?.message || 'Failed to load product');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [productId]);

  const addToCart = () => {
    const safeImageUrl = typeof product.image_url === 'string' && product.image_url.startsWith('data:')
      ? ''
      : product.image_url;

    const cart = JSON.parse(localStorage.getItem('drherbs_cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: safeImageUrl,
        quantity
      });
    }

    try {
      localStorage.setItem('drherbs_cart', JSON.stringify(cart));
    } catch (err) {
      try {
        const sanitized = cart.map((item) => ({ ...item, image_url: '' }));
        localStorage.setItem('drherbs_cart', JSON.stringify(sanitized));
      } catch {
        toast.error('Cart storage is full. Please clear your cart and try again.');
        return;
      }
    }

    window.dispatchEvent(new Event('cartUpdated'));
    toast.success(`Added ${quantity} item(s) to cart!`);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.comment) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      const newReview = await createReview({
        product_id: productId,
        reviewer_name: reviewForm.name,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      setReviews([newReview, ...reviews]);
      setReviewForm({ name: '', rating: 5, comment: '' });
      toast.success('Review submitted successfully!');
    } catch (err) {
      toast.error(err?.message || 'Failed to submit review');
    }
  };

  const images = [product?.image_url, ...(product?.images || [])].filter(Boolean);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-32 max-w-7xl mx-auto px-4">
          <div className="animate-pulse grid md:grid-cols-2 gap-12">
            <div className="aspect-square bg-gray-200 rounded-3xl" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-6 bg-gray-200 rounded w-1/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-32 text-center">
          <p className="text-gray-500 text-lg">Product not found</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Image Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-lg mb-4">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    src={images[selectedImage] || ''}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                {images.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        selectedImage === index
                          ? 'border-emerald-500'
                          : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Badge className="bg-emerald-100 text-emerald-700 mb-4">
                {product.category?.replace(/_/g, ' ')}
              </Badge>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < (product.rating || 4)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-500">({reviews?.length || 0} reviews)</span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-bold text-emerald-600">
                  ${product.price?.toFixed(2)}
                </span>
                {product.original_price && (
                  <span className="text-xl text-gray-400 line-through">
                    ${product.original_price?.toFixed(2)}
                  </span>
                )}
              </div>

              <div
                className="text-gray-600 text-lg mb-8 leading-relaxed prose max-w-none"
                dangerouslySetInnerHTML={{ __html: product.description || '' }}
              />

              {/* Benefits */}
              {product.benefits?.length > 0 && (
                <div className="mb-8">
                  <h3 className="font-semibold text-gray-900 mb-3">Key Benefits:</h3>
                  <ul className="space-y-2">
                    {product.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-600">
                        <Check className="w-5 h-5 text-emerald-500" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex items-center border rounded-xl">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="rounded-l-xl"
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="w-16 text-center font-semibold">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="rounded-r-xl"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <Button
                  onClick={addToCart}
                  className="flex-1 h-12 bg-emerald-500 hover:bg-emerald-600 gap-2 rounded-xl"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl">
                  <Heart className="w-5 h-5" />
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-100 rounded-2xl">
                <div className="flex flex-col items-center text-center">
                  <Truck className="w-6 h-6 text-emerald-600 mb-2" />
                  <span className="text-xs text-gray-600">Free Shipping</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <Shield className="w-6 h-6 text-emerald-600 mb-2" />
                  <span className="text-xs text-gray-600">Secure Payment</span>
                </div>
                <div className="flex flex-col items-center text-center">
                  <RefreshCw className="w-6 h-6 text-emerald-600 mb-2" />
                  <span className="text-xs text-gray-600">Easy Returns</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Tabs Section */}
          <Tabs defaultValue="reviews" className="bg-white rounded-3xl p-8 shadow-sm">
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-8">
              <TabsTrigger value="reviews">Reviews ({reviews?.length || 0})</TabsTrigger>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            </TabsList>

            <TabsContent value="reviews">
              {/* Review Form */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Write a Review</h3>
                <form onSubmit={submitReview} className="space-y-4">
                  <Input
                    placeholder="Your name"
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Rating:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= reviewForm.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <Textarea
                    placeholder="Your review..."
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    rows={4}
                  />
                  <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600">
                    Submit Review
                  </Button>
                </form>
              </div>

              {/* Reviews List */}
              <div className="space-y-6">
                {reviews?.length === 0 && (
                  <p className="text-center text-gray-500 py-8">No reviews yet. Be the first to review!</p>
                )}
                {reviews?.map((review) => (
                  <div key={review.id} className="border-b pb-6">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="font-semibold text-emerald-600">
                          {review.reviewer_name?.[0]?.toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{review.reviewer_name}</p>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="description" className="prose max-w-none">
              <div
                className="text-gray-600 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.description || '' }}
              />
            </TabsContent>

            <TabsContent value="ingredients">
              <p className="text-gray-600 leading-relaxed">
                {product.ingredients || 'Natural herbal ingredients carefully sourced from trusted suppliers.'}
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}