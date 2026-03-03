import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function Footer() {
  const footerLinks = {
    shop: [
      { name: 'All Products', path: 'Products' },
      { name: 'Herbs', path: 'Products?category=herbs' },
      { name: 'Supplements', path: 'Products?category=supplements' },
      { name: 'Teas', path: 'Products?category=teas' },
    ],
    company: [
      { name: 'About Us', path: 'About' },
      { name: 'Contact', path: 'Contact' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: '#', label: 'Youtube' },
  ];

  return (
    <footer className="bg-gradient-to-b from-emerald-900 to-emerald-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">Dr. Herbs</span>
            </div>
            <p className="text-emerald-200 text-sm leading-relaxed">
              Premium herbal products crafted with nature's finest ingredients. 
              Your journey to natural wellness starts here.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <motion.div
                  key={social.label}
                  whileHover={{ scale: 1.2, y: -2 }}
                  className="w-10 h-10 bg-emerald-800 hover:bg-emerald-700 rounded-full flex items-center justify-center transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <span className="text-emerald-200 transition-colors text-sm">
                    {link.name}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={createPageUrl(link.path)}
                    className="text-emerald-200 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-emerald-200">
                  123 Herbal Lane, Green Valley,<br />Nature City, NC 12345
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-emerald-200 transition-colors">
                  +1 (234) 567-890
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-emerald-200 transition-colors">
                  hello@drherbs.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-emerald-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-emerald-300 text-sm">
            {new Date().getFullYear()} Dr. Herbs. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <span className="text-emerald-300 transition-colors">Privacy Policy</span>
            <span className="text-emerald-300 transition-colors">Terms of Service</span>
            <span className="text-emerald-300 transition-colors">Refund Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}