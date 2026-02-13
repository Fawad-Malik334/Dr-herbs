import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Wellness Enthusiast',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    content: 'Dr. Herbs has completely transformed my wellness routine. The quality of their herbal products is unmatched, and I\'ve seen remarkable improvements in my energy levels and overall health.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Fitness Coach',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    content: 'As a fitness coach, I recommend Dr. Herbs supplements to all my clients. The natural ingredients and visible results speak for themselves. Truly premium quality!',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Yoga Instructor',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
    content: 'The herbal teas from Dr. Herbs have become an essential part of my daily meditation practice. They help me find balance and inner peace naturally.',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-24 bg-gradient-to-b from-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-medium mb-4">
            <Star className="w-4 h-4 fill-amber-500" />
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-emerald-900 mb-4">
            What Our Customers Say
          </h2>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl shadow-xl p-8 md:p-12 relative"
            >
              <Quote className="absolute top-8 right-8 w-16 h-16 text-emerald-100" />
              
              <div className="flex flex-col md:flex-row items-center gap-8">
                <img
                  src={testimonials[currentIndex].avatar}
                  alt={testimonials[currentIndex].name}
                  className="w-24 h-24 rounded-full object-cover ring-4 ring-emerald-100"
                />
                <div className="text-center md:text-left">
                  <div className="flex justify-center md:justify-start gap-1 mb-4">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-600 text-lg italic mb-6 leading-relaxed">
                    "{testimonials[currentIndex].content}"
                  </p>
                  <h4 className="font-bold text-gray-900 text-xl">
                    {testimonials[currentIndex].name}
                  </h4>
                  <p className="text-emerald-600">{testimonials[currentIndex].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-emerald-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? 'w-8 bg-emerald-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-emerald-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}