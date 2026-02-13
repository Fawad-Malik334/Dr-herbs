import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Clock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone',
    content: '+1 (234) 567-890',
    subtitle: 'Mon-Fri 9am-6pm',
  },
  {
    icon: Mail,
    title: 'Email',
    content: 'hello@drherbs.com',
    subtitle: 'We reply within 24 hours',
  },
  {
    icon: MapPin,
    title: 'Address',
    content: '123 Herbal Lane',
    subtitle: 'Green Valley, NC 12345',
  },
  {
    icon: Clock,
    title: 'Hours',
    content: 'Mon - Fri: 9am - 6pm',
    subtitle: 'Sat: 10am - 4pm',
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success('Message sent successfully! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 bg-gradient-to-r from-emerald-600 to-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-emerald-100 rounded-full text-sm font-medium mb-4">
              Get in Touch
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              We'd Love to Hear From You
            </h1>
            <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
              Have questions about our products or need personalized recommendations? 
              Our team is here to help you on your wellness journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16 bg-white relative -mt-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow"
              >
                <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <info.icon className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{info.title}</h3>
                <p className="text-emerald-600 font-medium">{info.content}</p>
                <p className="text-gray-500 text-sm">{info.subtitle}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="mt-1"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your message..."
                    rows={6}
                    className="mt-1"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full sm:w-auto h-12 px-8 bg-emerald-500 hover:bg-emerald-600 gap-2"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </motion.div>

            {/* Map / Additional Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1524813686514-a57563d77965?w=800&q=80"
                  alt="Our store"
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Visit Our Store
                  </h3>
                  <p className="text-gray-600">
                    Experience our products in person at our flagship store. 
                    Our knowledgeable staff is ready to assist you with personalized recommendations.
                  </p>
                </div>
              </div>

              <div className="bg-emerald-600 rounded-3xl p-8 text-white">
                <MessageCircle className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-semibold mb-3">
                  Need Quick Help?
                </h3>
                <p className="text-emerald-100 mb-4">
                  Our customer support team typically responds within 2 hours 
                  during business hours.
                </p>
                <Button className="bg-white text-emerald-600 hover:bg-emerald-50">
                  Start Live Chat
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 mb-8">
              Find quick answers to common questions about our products, shipping, and returns.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 text-left">
              {[
                'How long does shipping take?',
                'What is your return policy?',
                'Are products organic certified?',
                'How do I track my order?',
              ].map((question, index) => (
                <motion.div
                  key={question}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors cursor-pointer"
                >
                  <p className="font-medium text-gray-900">{question}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}