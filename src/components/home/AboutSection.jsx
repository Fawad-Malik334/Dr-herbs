import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Heart, Shield, Award } from 'lucide-react';

const features = [
  {
    icon: Leaf,
    title: '100% Natural',
    description: 'All our products are made from pure, organic ingredients sourced from trusted farms.',
  },
  {
    icon: Heart,
    title: 'Health Focused',
    description: 'Formulated by experts to support your wellness journey naturally and effectively.',
  },
  {
    icon: Shield,
    title: 'Quality Assured',
    description: 'Rigorous testing and quality control ensure the highest standards in every product.',
  },
  {
    icon: Award,
    title: 'Certified Products',
    description: 'All products are certified organic and meet international safety standards.',
  },
];

export default function AboutSection() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative z-10">
              <img
                src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80"
                alt="Natural herbs and ingredients"
                className="rounded-3xl shadow-2xl"
              />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, type: "spring" }}
              className="absolute -bottom-8 -right-8 w-48 h-48 bg-emerald-500 rounded-3xl -z-10"
            />
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: "spring" }}
              className="absolute -top-8 -left-8 w-32 h-32 bg-emerald-100 rounded-full -z-10"
            />
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
              About Dr. Herbs
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Nature's Wisdom,<br />
              <span className="text-emerald-600">Modern Wellness</span>
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              At Dr. Herbs, we believe in the transformative power of nature. Our mission is to 
              bring you the finest herbal products that combine ancient wisdom with modern science, 
              helping you achieve optimal health and vitality naturally.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                    <feature.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                    <p className="text-gray-500 text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}