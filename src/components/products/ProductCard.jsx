import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';

export default function ProductCard({ product }) {
  const addToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const cart = JSON.parse(localStorage.getItem('drherbs_cart') || '[]');
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        quantity: 1
      });
    }
    
    localStorage.setItem('drherbs_cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    toast.success('Added to cart!');
  };

  const discount = product.original_price 
    ? Math.round((1 - product.price / product.original_price) * 100) 
    : 0;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <Link to={createPageUrl(`ProductDetail?id=${product.id}`)}>
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            <img
              src={product.image_url || 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&q=80'}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {discount > 0 && (
                <Badge className="bg-red-500 text-white">-{discount}%</Badge>
              )}
              {product.featured && (
                <Badge className="bg-emerald-500 text-white">Featured</Badge>
              )}
            </div>

            {/* Quick Actions */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-50 transition-colors"
              >
                <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
              </motion.button>
            </div>

            {/* Add to Cart Button */}
            <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all transform translate-y-4 group-hover:translate-y-0">
              <Button 
                onClick={addToCart}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white gap-2 rounded-xl"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 bg-white">
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${
                    i < (product.rating || 4) 
                      ? 'fill-amber-400 text-amber-400' 
                      : 'text-gray-200'
                  }`} 
                />
              ))}
              <span className="text-gray-500 text-sm ml-1">
                ({product.review_count || 0})
              </span>
            </div>
            
            <h3 className="font-semibold text-emerald-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
              {product.name}
            </h3>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {product.short_description}
            </p>

            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-emerald-700">
                ${product.price?.toFixed(2)}
              </span>
              {product.original_price && (
                <span className="text-gray-400 line-through text-sm">
                  ${product.original_price?.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}