import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import HeroSlider from '@/components/home/HeroSlider';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import AboutSection from '@/components/home/AboutSection';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import NewsletterSection from '@/components/home/NewsletterSection';
import { listProducts } from '@/api/api';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [heroSlides, setHeroSlides] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const allProducts = await listProducts();
        const normalized = Array.isArray(allProducts) ? allProducts : [];

        const featured = normalized.filter((p) => p?.featured);
        setProducts(featured);

        const slides = featured
          .filter((p) => p && typeof p === 'object')
          .slice(0, 3)
          .map((p) => ({
            id: p.id,
            image: p.image_url || '',
            title: p.name || "Nature's Healing Power",
            subtitle: 'Featured Product',
            description: p.short_description || p.description || 'Discover premium herbal products for your wellness journey',
            cta: 'Shop Now',
          }));

        setHeroSlides(slides);

        const map = new Map();
        normalized.forEach((p) => {
          const slug = typeof p?.category === 'string' ? p.category : '';
          if (!slug) return;
          if (map.has(slug)) return;
          const name = slug
            .split(/[_-]/g)
            .filter(Boolean)
            .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
            .join(' ');
          map.set(slug, {
            slug,
            name,
            image: p.image_url || '',
          });
        });
        setCategories(Array.from(map.values()));
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 to-white">
      <Header />
      <main>
        <HeroSlider slides={heroSlides} />
        <FeaturedProducts products={products} isLoading={isLoading} />
        <AboutSection />
        <CategoryShowcase categories={categories} />
        <TestimonialsSection />
        <NewsletterSection />
      </main>

      <Footer />
    </div>
  );
}