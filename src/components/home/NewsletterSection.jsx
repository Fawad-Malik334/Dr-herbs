import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Thank you for subscribing!');
    setEmail('');
    setIsSubmitting(false);
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 via-emerald-600 to-green-600" />
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity,
          ease: "linear" 
        }}
        className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500 rounded-full opacity-30"
      />
      <motion.div
        animate={{ 
          rotate: -360,
          scale: [1, 1.3, 1],
        }}
        transition={{ 
          duration: 25, 
          repeat: Infinity,
          ease: "linear" 
        }}
        className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-400 rounded-full opacity-30"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring" }}
            className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <Sparkles className="w-8 h-8 text-white" />
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Join Our Wellness Journey
          </h2>
          <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
            Subscribe to receive exclusive offers, wellness tips, and be the first to know about new products
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-14 bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder:text-emerald-200 rounded-xl"
            />
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="h-14 px-8 bg-amber-400 text-emerald-900 hover:bg-amber-300 rounded-xl font-semibold gap-2"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                <Send className="w-4 h-4" />
              </Button>
            </motion.div>
          </form>

          <p className="text-emerald-200 text-sm mt-4">
            By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}