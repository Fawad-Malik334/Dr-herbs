import React from 'react';
import { motion } from 'framer-motion';
import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const categories = [
  { value: 'herbs', label: 'Herbs' },
  { value: 'supplements', label: 'Supplements' },
  { value: 'teas', label: 'Herbal Teas' },
  { value: 'oils', label: 'Essential Oils' },
  { value: 'skincare', label: 'Skincare' },
  { value: 'wellness', label: 'Wellness' },
];

export default function ProductFilters({ 
  filters, 
  setFilters, 
  isOpen, 
  setIsOpen 
}) {
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: 0,
      maxPrice: 500,
      rating: 0,
    });
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-6">
        <Button 
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          className="gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {/* Filter Sidebar */}
      <motion.div
        initial={false}
        animate={{ 
          x: isOpen ? 0 : '-100%',
          opacity: isOpen ? 1 : 0 
        }}
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-80 lg:w-full
          bg-white lg:bg-transparent p-6 lg:p-0 shadow-xl lg:shadow-none
          lg:translate-x-0 lg:opacity-100 overflow-y-auto
        `}
      >
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </h3>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={clearFilters}
              className="text-gray-500"
            >
              Clear all
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsOpen(false)}
              className="lg:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h4 className="font-medium text-gray-900 mb-4">Categories</h4>
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.value} className="flex items-center gap-3">
                <Checkbox
                  id={category.value}
                  checked={filters.category === category.value}
                  onCheckedChange={(checked) => 
                    updateFilter('category', checked ? category.value : '')
                  }
                />
                <Label 
                  htmlFor={category.value}
                  className="text-gray-600 cursor-pointer"
                >
                  {category.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-8">
          <h4 className="font-medium text-gray-900 mb-4">Price Range</h4>
          <div className="px-2">
            <Slider
              value={[filters.minPrice || 0, filters.maxPrice || 500]}
              min={0}
              max={500}
              step={10}
              onValueChange={([min, max]) => {
                updateFilter('minPrice', min);
                updateFilter('maxPrice', max);
              }}
              className="mb-4"
            />
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>${filters.minPrice || 0}</span>
              <span>${filters.maxPrice || 500}</span>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="mb-8">
          <h4 className="font-medium text-gray-900 mb-4">Minimum Rating</h4>
          <div className="space-y-2">
            {[4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-3">
                <Checkbox
                  id={`rating-${rating}`}
                  checked={filters.rating === rating}
                  onCheckedChange={(checked) => 
                    updateFilter('rating', checked ? rating : 0)
                  }
                />
                <Label 
                  htmlFor={`rating-${rating}`}
                  className="text-gray-600 cursor-pointer flex items-center gap-1"
                >
                  {rating}+ Stars
                </Label>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}
    </>
  );
}