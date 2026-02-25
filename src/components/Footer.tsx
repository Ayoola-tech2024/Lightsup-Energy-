import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import { Logo } from './Logo';

export const Footer = () => {
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    if (clickCount >= 3) {
      navigate('/admin/login');
      setClickCount(0);
    }

    const timer = setTimeout(() => {
      setClickCount(0);
    }, 1000);

    return () => clearTimeout(timer);
  }, [clickCount, navigate]);

  return (
    <footer className="bg-[var(--color-secondary)] text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="block mb-6">
              <Logo className="h-10" />
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Empowering Nigeria with reliable, sustainable, and cost-effective solar energy solutions for homes and businesses.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/lightsupgroup/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-2 rounded-full hover:bg-[var(--color-primary)] transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4 text-white" />
              </a>
              <a
                href="https://www.instagram.com/lightsupenergy_/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-2 rounded-full hover:bg-[var(--color-primary)] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4 text-white" />
              </a>
              <a
                href="https://ng.linkedin.com/company/lightsupenergy"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 p-2 rounded-full hover:bg-[var(--color-primary)] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 font-display">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', href: '/' },
                { name: 'About Us', href: '/contact' },
                { name: 'Services', href: '/services' },
                { name: 'Projects', href: '/projects' },
                { name: 'Blog', href: '/blog' },
                { name: 'Get a Quote', href: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gray-400 hover:text-[var(--color-secondary)] transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6 font-display">Our Services</h3>
            <ul className="space-y-3">
              {[
                'Solar Installation',
                'Inverter Systems',
                'Maintenance & Repairs',
                'Energy Consulting',
                'Battery Backup',
              ].map((item) => (
                <li key={item} className="text-gray-400 text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6 font-display">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[var(--color-primary)] shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">
                  123 Solar Avenue, Victoria Island, Lagos, Nigeria
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[var(--color-primary)] shrink-0" />
                <span className="text-gray-400 text-sm">+234 800 123 4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[var(--color-primary)] shrink-0" />
                <span className="text-gray-400 text-sm">hello@lightsup.ng</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} <span onClick={() => setClickCount(prev => prev + 1)} className="cursor-default select-none hover:text-gray-400 transition-colors">Lightsup Energy Solutions</span>. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-white text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-white text-sm">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
