import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu, X, Leaf, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createPageUrl } from '@/utils';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('drherbs_cart') || '[]');
      setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    };
    updateCartCount();
    window.addEventListener('storage', updateCartCount);
    window.addEventListener('cartUpdated', updateCartCount);
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  const navLinks = [
    { name: 'Home', path: 'Home' },
    { name: 'Products', path: 'Products' },
    { name: 'About', path: 'About' },
    { name: 'Contact', path: 'Contact' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to={createPageUrl('Home')} className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center"
            >
              <Leaf className="w-6 h-6 text-white" />
            </motion.div>
            <span className={`text-2xl font-bold transition-colors ${
              isScrolled ? 'text-emerald-800' : 'text-white'
            }`}>
              Dr. Herbs
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={createPageUrl(link.path)}
                className={`relative font-medium transition-colors hover:text-emerald-500 ${
                  isScrolled ? 'text-gray-700' : 'text-white'
                }`}
              >
                <motion.span
                  whileHover={{ y: -2 }}
                  className="inline-block"
                >
                  {link.name}
                </motion.span>
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link to={createPageUrl('Cart')}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Button 
                  variant="ghost" 
                  size="icon"
                  className={isScrolled ? 'text-gray-700' : 'text-white hover:bg-white/20'}
                >
                  <ShoppingCart className="w-5 h-5" />
                </Button>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </motion.div>
            </Link>

            <Link to={createPageUrl('AdminLogin')} className="hidden md:block">
              <Button 
                variant={isScrolled ? "outline" : "secondary"}
                className="gap-2"
              >
                <User className="w-4 h-4" />
                Admin
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className={`md:hidden ${isScrolled ? 'text-gray-700' : 'text-white'}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t shadow-lg"
          >
            <nav className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={createPageUrl(link.path)}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to={createPageUrl('AdminLogin')}
                onClick={() => setIsMobileMenuOpen(false)}
                className="px-4 py-3 text-emerald-600 font-medium hover:bg-emerald-50 rounded-lg transition-colors"
              >
                Admin Login
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}