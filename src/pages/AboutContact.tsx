import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/Button';
import { Reveal } from '@/components/Reveal';
import { Phone, Mail, MapPin, ChevronDown, ChevronUp, Send, Loader2, Check } from 'lucide-react';
import { submitQuote } from '@/services/db';
import { sendEmail } from '@/services/emailService';

export const AboutContact = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Solar Installation',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const faqs = [
    {
      q: 'How much does a solar system cost?',
      a: 'The cost depends on your energy needs. A basic backup system starts from ₦500,000, while full home solar solutions typically range from ₦2M to ₦10M+. We provide custom quotes after assessing your load.',
    },
    {
      q: 'Do you offer warranties?',
      a: 'Yes! We offer a 25-year performance warranty on solar panels, 5-year warranty on inverters, and 3-5 year warranty on batteries, depending on the brand.',
    },
    {
      q: 'Can I run my ACs on solar?',
      a: 'Absolutely. We design systems specifically to handle heavy inductive loads like Air Conditioners, Freezers, and Pumping machines. You just need the right capacity.',
    },
    {
      q: 'How long does installation take?',
      a: 'Residential installations typically take 1-3 days. Commercial projects may take 1-2 weeks depending on complexity.',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitQuote(formState);
      
      // Send confirmation email
      await sendEmail({
        to_name: formState.name,
        to_email: formState.email,
        message: `
          New Quote Request:
          
          Name: ${formState.name}
          Phone: ${formState.phone}
          Email: ${formState.email}
          Service: ${formState.service}
          
          Message:
          ${formState.message}
        `
      });

      setSubmitStatus('success');
      setFormState({ name: '', phone: '', email: '', service: 'Solar Installation', message: '' });
    } catch (error) {
      console.error(error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-20">
      {/* About Hero */}
      <section className="bg-[var(--color-secondary)] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Reveal width="100%">
              <h1 className="text-4xl md:text-6xl font-bold font-display mb-6">About Lightsup</h1>
            </Reveal>
            <Reveal width="100%" delay={0.3}>
              <p className="text-xl text-gray-300">
                We are on a mission to light up Nigeria, one home and business at a time.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Reveal>
              <div className="relative">
                <div className="absolute -inset-4 bg-[var(--color-primary)] rounded-2xl opacity-20 rotate-3" />
                <img
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop"
                  alt="Our Team"
                  className="relative rounded-2xl shadow-xl w-full"
                  referrerPolicy="no-referrer"
                />
              </div>
            </Reveal>
            <div className="space-y-8">
              <Reveal delay={0.2}>
                <div>
                  <h2 className="text-3xl font-bold font-display mb-4 text-[var(--color-secondary)]">Who We Are</h2>
                  <p className="text-gray-600 leading-relaxed">
                    Lightsup Energy Solutions is a leading renewable energy company based in Lagos, Nigeria. Founded in 2020, we have rapidly grown to become a trusted name in the solar industry, known for our uncompromising quality and exceptional customer support.
                  </p>
                </div>
              </Reveal>
              
              <Reveal delay={0.3}>
                <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-[var(--color-primary)]">
                  <h3 className="text-xl font-bold font-display mb-2 text-[var(--color-secondary)]">Our Mission</h3>
                  <p className="text-gray-600">
                    To provide accessible, reliable, and sustainable energy solutions that empower Nigerians to be productive and comfortable, regardless of the grid status.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.4}>
                <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-[var(--color-secondary)]">
                  <h3 className="text-xl font-bold font-display mb-2 text-[var(--color-secondary)]">Our Vision</h3>
                  <p className="text-gray-600">
                    To be the catalyst for Nigeria's energy transition, making clean power the standard for every household and enterprise.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <Reveal width="100%">
            <h2 className="text-3xl md:text-4xl font-bold font-display text-center mb-12 text-[var(--color-secondary)]">
              Frequently Asked Questions
            </h2>
          </Reveal>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Reveal key={index} delay={index * 0.1} width="100%">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-bold text-gray-900">{faq.q}</span>
                    {openFaq === index ? (
                      <ChevronUp className="h-5 w-5 text-[var(--color-primary)]" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  <AnimatePresence>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 pt-0 text-gray-600 border-t border-gray-50">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Info */}
            <div>
              <Reveal>
                <h2 className="text-3xl md:text-4xl font-bold font-display mb-6 text-[var(--color-secondary)]">Get in Touch</h2>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="text-gray-600 mb-10">
                  Ready to start your solar journey? Visit our office, call us, or send a message. We're here to help.
                </p>
              </Reveal>
              
              <div className="space-y-8">
                {[
                  { icon: MapPin, title: 'Visit Us', content: '123 Adetokunbo Ademola Street, Victoria Island, Lagos' },
                  { icon: Phone, title: 'Call Us', content: '07036791927' },
                  { icon: Mail, title: 'Email Us', content: 'hello@lightsupenergy.com' },
                ].map((item, i) => (
                  <Reveal key={i} delay={0.3 + (i * 0.1)}>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center shrink-0">
                        <item.icon className="h-6 w-6 text-[var(--color-primary)]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                        <p className="text-gray-600">{item.content}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              {/* Map Placeholder */}
              <Reveal delay={0.6}>
                <div className="mt-10 h-64 bg-gray-100 rounded-2xl overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop" 
                    alt="Map Location" 
                    className="w-full h-full object-cover opacity-50"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button variant="outline" className="bg-white/80 backdrop-blur-sm">
                      View on Google Maps
                    </Button>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Contact Form */}
            <Reveal direction="left" delay={0.4}>
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <h3 className="text-2xl font-bold font-display mb-6 text-[var(--color-secondary)]">Request a Free Quote</h3>
                
                {submitStatus === 'success' ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-green-50 text-green-800 p-8 rounded-xl text-center"
                  >
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                    <h4 className="text-xl font-bold mb-2">Request Sent!</h4>
                    <p>Thank you for contacting us. One of our energy consultants will reach out to you shortly.</p>
                    <Button 
                      className="mt-6" 
                      variant="outline" 
                      onClick={() => setSubmitStatus('idle')}
                    >
                      Send Another Request
                    </Button>
                  </motion.div>
                ) : submitStatus === 'error' ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-50 text-red-800 p-8 rounded-xl text-center"
                  >
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-red-600">!</span>
                    </div>
                    <h4 className="text-xl font-bold mb-2">Submission Failed</h4>
                    <p>We couldn't send your request. Please check your connection and try again.</p>
                    <Button 
                      className="mt-6" 
                      variant="outline" 
                      onClick={() => setSubmitStatus('idle')}
                    >
                      Try Again
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all"
                          placeholder="John Doe"
                          value={formState.name}
                          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                          type="tel"
                          required
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all"
                          placeholder="+234..."
                          value={formState.phone}
                          onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Email Address</label>
                      <input
                        type="email"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all"
                        placeholder="john@example.com"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Service Interested In</label>
                      <select
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all bg-white"
                        value={formState.service}
                        onChange={(e) => setFormState({ ...formState, service: e.target.value })}
                      >
                        <option>Solar Installation</option>
                        <option>Inverter System</option>
                        <option>Maintenance</option>
                        <option>Consulting</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Message (Optional)</label>
                      <textarea
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 outline-none transition-all resize-none"
                        placeholder="Tell us about your energy needs..."
                        value={formState.message}
                        onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full shadow-lg shadow-[var(--color-primary)]/20" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Request <Send className="h-5 w-5 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
};
