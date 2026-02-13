import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    name: 'Herbs',
    slug: 'herbs',
    image: 'https://images.unsplash.com/photo-1515586000433-45406d8e6662?w=600&q=80',
    description: 'Pure dried herbs for natural healing',
  },
  {
    name: 'Supplements',
    slug: 'supplements',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80',
    description: 'Natural supplements for daily wellness',
  },
  {
    name: 'Herbal Teas',
    slug: 'teas',
    image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&q=80',
    description: 'Soothing teas for mind and body',
  },
  {
    name: 'Essential Oils',
    slug: 'oils',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&q=80',
    description: 'Premium aromatherapy oils',
  },
];

export default function CategoryShowcase() {
  return (
    <section className="py-24 bg-emerald-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-800/50 text-amber-400 rounded-full text-sm font-medium mb-4 border border-emerald-700">
            <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
            Categories
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Shop by Category
          </h2>
          <p className="text-emerald-200 max-w-2xl mx-auto text-lg">
            Explore our curated collection of natural wellness products
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={createPageUrl(`Products?category=${category.slug}`)}>
                <motion.div
                  whileHover={{ y: -8 }}
                  className="group relative rounded-3xl overflow-hidden h-80 cursor-pointer"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                    <p className="text-gray-300 text-sm mb-4">{category.description}</p>
                    <span className="inline-flex items-center gap-2 text-amber-400 font-medium group-hover:gap-3 transition-all">
                      Shop Now <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}