import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Heart, Users, Award, Target, Globe } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const stats = [
  { number: '10K+', label: 'Happy Customers' },
  { number: '500+', label: 'Products' },
  { number: '15+', label: 'Years Experience' },
  { number: '50+', label: 'Countries' },
];

const values = [
  {
    icon: Leaf,
    title: 'Natural & Organic',
    description: 'We source only the finest organic ingredients from sustainable farms worldwide.',
  },
  {
    icon: Heart,
    title: 'Customer First',
    description: 'Your wellness is our priority. We provide personalized support for every customer.',
  },
  {
    icon: Award,
    title: 'Quality Assured',
    description: 'Every product undergoes rigorous testing to meet the highest quality standards.',
  },
  {
    icon: Globe,
    title: 'Eco-Friendly',
    description: 'Committed to sustainable practices and eco-friendly packaging.',
  },
];

const team = [
  {
    name: 'Dr. Sarah Mitchell',
    role: 'Founder & Herbalist',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80',
  },
  {
    name: 'Dr. James Chen',
    role: 'Head of Research',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80',
  },
  {
    name: 'Emma Wilson',
    role: 'Quality Director',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
  },
];

export default function About() {
  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1920&q=80"
            alt="Herbs background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-emerald-800/80" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-emerald-200 rounded-full text-sm font-medium mb-6">
              Our Story
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Bringing Nature's<br />
              <span className="text-emerald-300">Best to You</span>
            </h1>
            <p className="text-xl text-emerald-100 leading-relaxed">
              For over 15 years, Dr. Herbs has been dedicated to providing the highest quality 
              herbal products, combining ancient wisdom with modern science to enhance your 
              natural wellness journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white relative -mt-16 mx-4 sm:mx-8 lg:mx-auto max-w-6xl rounded-3xl shadow-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <p className="text-4xl md:text-5xl font-bold text-emerald-600 mb-2">
                {stat.number}
              </p>
              <p className="text-gray-500">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
                Our Mission
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Empowering Wellness Through Nature
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                At Dr. Herbs, we believe that nature holds the key to optimal health. Our mission 
                is to make the healing power of herbs accessible to everyone, providing products 
                that are pure, potent, and effective.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                We work directly with organic farmers around the world, ensuring sustainable 
                practices that protect both the environment and the communities we serve.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80"
                alt="Our mission"
                className="rounded-3xl shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-emerald-500 rounded-3xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
              Our Values
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What We Stand For
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-500">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-emerald-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block px-4 py-2 bg-emerald-900 text-emerald-400 rounded-full text-sm font-medium mb-4">
              Our Team
            </span>
            <h2 className="text-4xl font-bold text-white mb-4">
              Meet the Experts
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden ring-4 ring-emerald-500">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
                <p className="text-emerald-400">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}