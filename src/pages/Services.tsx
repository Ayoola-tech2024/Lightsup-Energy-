import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/Button';
import { Reveal } from '@/components/Reveal';
import { Sun, Battery, Wrench, Lightbulb, Check, Calculator, ArrowRight } from 'lucide-react';

export const Services = () => {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-[var(--color-secondary)] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Reveal width="100%">
              <h1 className="text-4xl md:text-6xl font-bold font-display mb-6">Our Services</h1>
            </Reveal>
            <Reveal width="100%" delay={0.3}>
              <p className="text-xl text-gray-300">
                End-to-end solar energy solutions tailored to your specific needs.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Service Details */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="space-y-32">
            {[
              {
                id: 'installation',
                title: 'Solar Installation',
                desc: 'We design and install high-efficiency solar power systems for residential, commercial, and industrial properties. Our certified engineers ensure seamless integration with your existing electrical infrastructure.',
                features: ['Site Assessment & Design', 'Tier-1 Solar Panels', 'Professional Mounting', 'Safety & Compliance Checks'],
                icon: Sun,
                image: 'https://images.unsplash.com/photo-1611365892117-00ac5ef43c90?q=80&w=800&auto=format&fit=crop',
              },
              {
                id: 'inverter',
                title: 'Inverter & Battery Systems',
                desc: 'Say goodbye to noise and fumes. Our advanced inverter and battery storage solutions provide clean, silent, and instant backup power when the grid fails.',
                features: ['Hybrid & Off-Grid Inverters', 'Lithium-Ion Batteries', 'Smart Monitoring Apps', 'Load Balancing'],
                icon: Battery,
                image: 'https://images.unsplash.com/photo-1624397640148-949b1732bb0a?q=80&w=800&auto=format&fit=crop',
              },
              {
                id: 'maintenance',
                title: 'Maintenance & Repairs',
                desc: 'Protect your investment with our comprehensive maintenance packages. We keep your system running at peak performance to maximize energy production and lifespan.',
                features: ['Panel Cleaning', 'System Health Checks', 'Firmware Updates', 'Emergency Repairs'],
                icon: Wrench,
                image: 'https://images.unsplash.com/photo-1592833159155-c62df1b65634?q=80&w=800&auto=format&fit=crop',
              },
              {
                id: 'consulting',
                title: 'Energy Consulting',
                desc: 'Not sure what you need? Our experts analyze your energy consumption patterns to recommend the most cost-effective solution for your budget and goals.',
                features: ['Energy Audits', 'Load Analysis', 'ROI Calculations', 'Sustainability Strategy'],
                icon: Lightbulb,
                image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
              },
            ].map((service, index) => (
              <div key={service.id} className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 items-center`}>
                <div className="flex-1">
                  <Reveal>
                    <div className="w-16 h-16 bg-[var(--color-primary)]/10 rounded-2xl flex items-center justify-center mb-6">
                      <service.icon className="h-8 w-8 text-[var(--color-primary)]" />
                    </div>
                  </Reveal>
                  <Reveal delay={0.3}>
                    <h2 className="text-3xl md:text-4xl font-bold font-display mb-6 text-[var(--color-secondary)]">{service.title}</h2>
                  </Reveal>
                  <Reveal delay={0.4}>
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                      {service.desc}
                    </p>
                  </Reveal>
                  <Reveal delay={0.5}>
                    <ul className="space-y-4 mb-8">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <div className="bg-green-100 p-1 rounded-full">
                            <Check className="h-4 w-4 text-green-600" />
                          </div>
                          <span className="font-medium text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                  <Reveal delay={0.6}>
                    <Button href="/contact" className="gap-2 shadow-lg shadow-[var(--color-primary)]/20">
                      Request Quote <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Reveal>
                </div>
                <div className="flex-1 w-full">
                  <Reveal direction={index % 2 === 1 ? 'left' : 'right'}>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-[var(--color-secondary)] rounded-2xl rotate-3 opacity-10 group-hover:rotate-6 transition-transform duration-500" />
                      <img
                        src={service.image}
                        alt={service.title}
                        className="relative rounded-2xl shadow-xl w-full object-cover aspect-video group-hover:scale-[1.02] transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </Reveal>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Reveal width="100%">
                <div className="inline-flex items-center justify-center p-3 bg-[var(--color-primary)]/10 rounded-full mb-4">
                  <Calculator className="h-8 w-8 text-[var(--color-primary)]" />
                </div>
              </Reveal>
              <Reveal width="100%" delay={0.2}>
                <h2 className="text-3xl md:text-4xl font-bold font-display mb-4 text-[var(--color-secondary)]">Solar Savings Calculator</h2>
              </Reveal>
              <Reveal width="100%" delay={0.3}>
                <p className="text-gray-600">Estimate your potential savings by switching to solar.</p>
              </Reveal>
            </div>
            
            <Reveal delay={0.4}>
              <SolarCalculator />
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
};

const SolarCalculator = () => {
  const [bill, setBill] = useState<number>(50000);
  const [hours, setHours] = useState<number>(5);

  // Simple estimation logic (for demonstration)
  const systemSize = (bill / 100) * 0.02; // Rough estimate in kW
  const monthlySavings = bill * 0.8; // Assuming 80% reduction
  const paybackPeriod = (systemSize * 1000000) / (monthlySavings * 12); // Assuming 1kW costs 1M Naira

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Electricity Bill (₦)
            </label>
            <input
              type="range"
              min="10000"
              max="500000"
              step="5000"
              value={bill}
              onChange={(e) => setBill(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
            />
            <div className="mt-2 text-2xl font-bold text-[var(--color-secondary)]">
              ₦{bill.toLocaleString()}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Daily Sun Hours (Average)
            </label>
            <input
              type="range"
              min="3"
              max="8"
              step="0.5"
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-primary)]"
            />
            <div className="mt-2 text-2xl font-bold text-[var(--color-secondary)]">
              {hours} hours
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-800">
            <p><strong>Note:</strong> This is a rough estimate. Actual savings depend on roof orientation, shading, and equipment used.</p>
          </div>
        </div>

        <div className="bg-[var(--color-secondary)] text-white rounded-xl p-8 flex flex-col justify-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)] rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
          
          <div>
            <div className="text-gray-400 text-sm uppercase tracking-wider font-medium mb-1">Recommended System</div>
            <div className="text-4xl font-bold font-display text-[var(--color-primary)]">{systemSize.toFixed(1)} kW</div>
          </div>
          
          <div>
            <div className="text-gray-400 text-sm uppercase tracking-wider font-medium mb-1">Est. Monthly Savings</div>
            <div className="text-3xl font-bold font-display">₦{monthlySavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </div>
          
          <div>
            <div className="text-gray-400 text-sm uppercase tracking-wider font-medium mb-1">Est. Payback Period</div>
            <div className="text-3xl font-bold font-display">{paybackPeriod.toFixed(1)} Years</div>
          </div>
          
          <Button href="/contact" variant="primary" className="w-full mt-4 bg-white text-[var(--color-secondary)] hover:bg-gray-100 border-none">
            Get Detailed Quote
          </Button>
        </div>
      </div>
    </div>
  );
};
