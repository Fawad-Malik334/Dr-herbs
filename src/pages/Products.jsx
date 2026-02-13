import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/products/ProductCard';
import ProductFilters from '@/components/products/ProductFilters';
import { getProducts } from '@/components/data/sampleProducts';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: 0,
    maxPrice: 500,
    rating: 0,
  });

  // Get category from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    if (category) {
      setFilters(prev => ({ ...prev, category }));
    }
  }, []);

  // Load products from localStorage
  useEffect(() => {
    const loadProducts = () => {
      const allProducts = getProducts();
      setProducts(allProducts);
      setIsLoading(false);
    };
    loadProducts();
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    return products
      .filter(product => {
        // Search filter
        if (searchQuery && !product.name?.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        // Category filter
        if (filters.category && product.category !== filters.category) {
          return false;
        }
        // Price filter
        if (product.price < filters.minPrice || product.price > filters.maxPrice) {
          return false;
        }
        // Rating filter
        if (filters.rating && (product.rating || 0) < filters.rating) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'rating':
            return (b.rating || 0) - (a.rating || 0);
          case 'newest':
          default:
            return new Date(b.created_date) - new Date(a.created_date);
        }
      });
  }, [products, searchQuery, filters, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/30 to-white">
      <Header />
      
      {/* Hero Banner */}
      <div className="pt-20 bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600/50 text-amber-300 rounded-full text-sm font-medium mb-4 border border-emerald-500/50">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></span>
              Premium Collection
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Our Products
            </h1>
            <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
              Discover our complete collection of premium herbal products
            </p>
          </motion.div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Sort Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-xl border-gray-200"
            />
          </div>
          <div className="flex gap-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 h-12 rounded-xl">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="lg:hidden h-12 px-4 rounded-xl"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <ProductFilters 
              filters={filters}
              setFilters={setFilters}
              isOpen={isFilterOpen}
              setIsOpen={setIsFilterOpen}
            />
          </aside>

          {/* Mobile Filters */}
          <div className="lg:hidden">
            <ProductFilters 
              filters={filters}
              setFilters={setFilters}
              isOpen={isFilterOpen}
              setIsOpen={setIsFilterOpen}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {filteredProducts.length} products found
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-2xl aspect-square mb-4" />
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">No products found</p>
                <p className="text-gray-400 mt-2">Try adjusting your filters</p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}