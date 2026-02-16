import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowRight, ImageIcon } from 'lucide-react';

export default function CategoryShowcase({ categories = [] }) {
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
          {(categories || []).map((category, index) => (
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
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center text-emerald-200/50">
                      <ImageIcon className="w-14 h-14" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-2">{category.name}</h3>
                    {category.description && (
                      <p className="text-gray-300 text-sm mb-4">{category.description}</p>
                    )}
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