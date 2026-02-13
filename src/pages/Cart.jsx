import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const loadCart = () => {
      const cart = JSON.parse(localStorage.getItem('drherbs_cart') || '[]');
      setCartItems(cart);
    };
    loadCart();
    window.addEventListener('storage', loadCart);
    window.addEventListener('cartUpdated', loadCart);
    return () => {
      window.removeEventListener('storage', loadCart);
      window.removeEventListener('cartUpdated', loadCart);
    };
  }, []);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCart);
    localStorage.setItem('drherbs_cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('drherbs_cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
    toast.success('Item removed from cart');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 to-white">
      <Header />
      
      <main className="pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-emerald-900 mb-8">
              Shopping Cart
            </h1>

            {cartItems.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl shadow-sm">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-8">Looks like you haven't added anything yet</p>
                <Link to={createPageUrl('Products')}>
                  <Button className="bg-emerald-500 hover:bg-emerald-600 gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  <AnimatePresence>
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row gap-4 sm:gap-6"
                      >
                        <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                          <img
                            src={item.image_url || 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&q=80'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between mb-2">
                            <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-red-500"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </div>
                          
                          <p className="text-emerald-600 font-semibold text-xl mb-4">
                            ${item.price?.toFixed(2)}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center border rounded-lg">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="h-10 w-10"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-12 text-center font-semibold">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-10 w-10"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                            <p className="font-semibold text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-3xl p-6 shadow-sm sticky top-28"
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Order Summary
                    </h2>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Shipping</span>
                        <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                      </div>
                      {shipping > 0 && (
                        <p className="text-sm text-emerald-600">
                          Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                        </p>
                      )}
                      <div className="border-t pt-4 flex justify-between text-lg font-semibold text-gray-900">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>

                    <Link to={createPageUrl('Checkout')}>
                      <Button className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 gap-2 text-lg rounded-xl">
                        Proceed to Checkout
                        <ArrowRight className="w-5 h-5" />
                      </Button>
                    </Link>

                    <Link to={createPageUrl('Products')} className="block mt-4">
                      <Button variant="outline" className="w-full gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Continue Shopping
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}