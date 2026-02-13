import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSlider from '@/components/home/HeroSlider';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import AboutSection from '@/components/home/AboutSection';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import NewsletterSection from '@/components/home/NewsletterSection';
import { getFeaturedProducts } from '@/components/data/sampleProducts';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load featured products from localStorage
    const loadProducts = () => {
      const featuredProducts = getFeaturedProducts();
      setProducts(featuredProducts);
      setIsLoading(false);
    };
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-white">
      <Header />
      <main>
        <HeroSlider />
        <FeaturedProducts products={products} isLoading={isLoading} />
        <AboutSection />
        <CategoryShowcase />
        <TestimonialsSection />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  );
}