import React from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/Button';
import { Reveal } from '@/components/Reveal';
import { ArrowRight, Sun, Battery, Wrench, Lightbulb, CheckCircle2, Star } from 'lucide-react';
import { SolarCalculator } from '@/components/SolarCalculator';
import { Testimonials } from '@/components/Testimonials';
import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-[var(--color-secondary)] text-white">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1920&auto=format&fit=crop"
            alt="Solar Panels on Roof"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-secondary)]/90 via-[var(--color-secondary)]/60 to-transparent" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10 pt-20">
          <div className="max-w-3xl">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 text-[var(--color-primary)] text-sm font-medium mb-6 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-primary)]"></span>
                </span>
                #Trusted and reliable Solar Energy Provider in Nigeria
              </div>
            </Reveal>
            
            <Reveal delay={0.3}>
              <h1 className="text-5xl md:text-7xl font-bold font-display leading-tight mb-6">
                Power Your Future with <span className="text-[var(--color-primary)]">Clean Energy</span>
              </h1>
            </Reveal>

            <Reveal delay={0.4}>
              <p className="text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed">
                Reliable, cost-effective solar solutions for homes and businesses across Nigeria. Say goodbye to blackouts and expensive fuel bills.
              </p>
            </Reveal>

            <Reveal delay={0.5}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" href="/contact" className="gap-2 shadow-lg shadow-[var(--color-primary)]/20">
                  Get a Free Quote <ArrowRight className="h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" href="/projects" className="bg-white/10 border-white/20 text-white hover:bg-white hover:text-[var(--color-secondary)] backdrop-blur-sm">
                  View Our Projects
                </Button>
              </div>
            </Reveal>
            
            <Reveal delay={0.6}>
              <div className="mt-12 flex flex-wrap items-center gap-8 text-sm font-medium text-gray-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[var(--color-primary)]" />
                  <span>5-Year Warranty</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[var(--color-primary)]" />
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-[var(--color-primary)]" />
                  <span>Certified Installers</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Image Gallery Strip */}
      <section className="py-0 bg-white">
        <div className="grid grid-cols-2 md:grid-cols-4 h-48 md:h-64">
          {[
            { src: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?q=80&w=800&auto=format&fit=crop', label: 'Residential' },
            { src: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=800&auto=format&fit=crop', label: 'Commercial' },
            { src: 'https://images.unsplash.com/photo-1548337138-e87d889cc369?q=80&w=800&auto=format&fit=crop', label: 'Systems' },
            { src: 'https://images.unsplash.com/photo-1592833159155-c62df1b65634?q=80&w=800&auto=format&fit=crop', label: 'Maintenance' }
          ].map((item, i) => (
            <div key={i} className="relative group overflow-hidden">
              <img
                src={item.src}
                alt={item.label}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
              <div className="absolute bottom-4 left-4">
                <span className="text-white font-bold text-sm uppercase tracking-wider bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Reveal width="100%">
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-4 text-[var(--color-secondary)]">
                Comprehensive Energy Solutions
              </h2>
            </Reveal>
            <Reveal width="100%" delay={0.3}>
              <p className="text-gray-600 text-lg">
                From residential rooftops to industrial power plants, we deliver excellence in every watt.
              </p>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Sun,
                title: 'Solar Installation',
                desc: 'Turnkey solar systems designed for maximum efficiency and longevity.',
              },
              {
                icon: Battery,
                title: 'Inverter Systems',
                desc: 'High-capacity battery backups to keep your lights on when the grid goes down.',
              },
              {
                icon: Wrench,
                title: 'Maintenance',
                desc: 'Proactive monitoring and cleaning to ensure peak performance year-round.',
              },
              {
                icon: Lightbulb,
                title: 'Energy Consulting',
                desc: 'Expert audits to optimize your consumption and reduce energy costs.',
              },
            ].map((service, index) => (
              <Reveal key={index} delay={0.2 * index} className="h-full">
                <motion.div
                  whileHover={{ y: -10 }}
                  className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-xl hover:shadow-[var(--color-primary)]/5 transition-all group h-full flex flex-col"
                >
                  <div className="w-14 h-14 bg-[var(--color-primary)]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[var(--color-primary)] transition-colors duration-300">
                    <service.icon className="h-7 w-7 text-[var(--color-primary)] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold font-display mb-3 text-[var(--color-secondary)]">{service.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed flex-grow">{service.desc}</p>
                  <Link to="/services" className="text-[var(--color-primary)] font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">
                    Learn more <ArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Solar Showcase Grid */}
      <section className="py-0">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <div className="h-80 md:h-96 relative group overflow-hidden">
             <img 
               src="https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop" 
               alt="High Efficiency Solar Panels" 
               className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
               referrerPolicy="no-referrer"
             />
             <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white font-display font-bold text-xl">High Efficiency Panels</span>
             </div>
          </div>
          <div className="h-80 md:h-96 relative group overflow-hidden">
             <img 
               src="https://images.unsplash.com/photo-1548337138-e87d889cc369?q=80&w=800&auto=format&fit=crop" 
               alt="Advanced Inverter System" 
               className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
               referrerPolicy="no-referrer"
             />
             <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white font-display font-bold text-xl">Advanced Inverters</span>
             </div>
          </div>
          <div className="h-80 md:h-96 relative group overflow-hidden">
             <img 
               src="https://images.unsplash.com/photo-1624397640148-949b1732bb0a?q=80&w=800&auto=format&fit=crop" 
               alt="Long-lasting Battery Storage" 
               className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
               referrerPolicy="no-referrer"
             />
             <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white font-display font-bold text-xl">Long-lasting Storage</span>
             </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-[var(--color-secondary)] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[var(--color-primary)]/5 skew-x-12 transform origin-top-right" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <Reveal>
                <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">
                  Why Nigeria Trusts Lightsup
                </h2>
              </Reveal>
              <Reveal delay={0.3}>
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  We don't just sell products; we engineer reliability. In a market flooded with substandard equipment, we stand for quality, durability, and peace of mind.
                </p>
              </Reveal>
              
              <div className="space-y-6">
                {[
                  { title: 'Tier-1 Equipment', desc: 'We only use globally recognized brands with proven track records.' },
                  { title: 'Local Expertise', desc: 'Designed specifically for Nigerian climate and grid conditions.' },
                  { title: 'Transparent Pricing', desc: 'No hidden fees. What we quote is what you pay.' },
                ].map((item, i) => (
                  <Reveal key={i} delay={0.2 * i} direction="left">
                    <div className="flex gap-4">
                      <div className="mt-1 bg-[var(--color-primary)]/20 p-2 rounded-lg h-fit">
                        <CheckCircle2 className="h-5 w-5 text-[var(--color-primary)]" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold font-display mb-1">{item.title}</h4>
                        <p className="text-gray-400">{item.desc}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
              
              <Reveal delay={0.8}>
                <Button className="mt-10" size="lg" href="/contact">
                  Schedule a Consultation
                </Button>
              </Reveal>
            </div>
            
            <Reveal direction="right">
              <div className="relative">
                <div className="absolute -inset-4 bg-[var(--color-primary)] rounded-2xl opacity-20 blur-2xl" />
                <img 
                  src="https://images.unsplash.com/photo-1585123388867-3bfe6dd4bdbf?q=80&w=800&auto=format&fit=crop" 
                  alt="Solar Installation" 
                  className="relative rounded-2xl shadow-2xl border border-white/10"
                  referrerPolicy="no-referrer"
                />
                
                {/* Floating Stat Card */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -bottom-6 -left-6 bg-white text-[var(--color-secondary)] p-6 rounded-xl shadow-xl max-w-xs"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4 text-yellow-400 fill-current" />)}
                    </div>
                    <span className="font-bold">4.9/5</span>
                  </div>
                  <p className="text-sm font-medium">"Best investment I've made for my home. The team was professional and fast."</p>
                  <p className="text-xs text-gray-500 mt-2">— Emmanuel O., Lagos</p>
                </motion.div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Solar Calculator Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Reveal width="100%">
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-4 text-[var(--color-secondary)]">
                Solar System Calculator
              </h2>
            </Reveal>
            <Reveal width="100%" delay={0.2}>
              <p className="text-gray-600 text-lg">
                Estimate your energy needs and find the perfect solar solution for your home or office.
              </p>
            </Reveal>
          </div>

          <SolarCalculator />
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <section className="py-24 bg-[var(--color-primary)] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <Reveal width="100%">
            <h2 className="text-3xl md:text-5xl font-bold font-display mb-6">
              Ready to Switch to Solar?
            </h2>
          </Reveal>
          <Reveal width="100%" delay={0.2}>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Get a free quote today and start saving on your energy bills. No commitment required.
            </p>
          </Reveal>
          <Reveal width="100%" delay={0.4}>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" variant="secondary" href="/contact" className="bg-[var(--color-secondary)] text-white hover:bg-[var(--color-secondary-dark)] border-none">
                Request a Quote
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-[var(--color-primary)]">
                Call: 07036791927
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
};
