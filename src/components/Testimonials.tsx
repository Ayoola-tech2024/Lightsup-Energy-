import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/Button';
import { Reveal } from '@/components/Reveal';
import { Star, MessageSquare, Send, Loader2, Check, User, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { submitTestimonial, getTestimonials, Testimonial } from '@/services/db';
import { sendEmail } from '@/services/emailService';
import { format } from 'date-fns';

export const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Form State
  const [formState, setFormState] = useState({
    name: '',
    role: '',
    content: '',
    rating: 5
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const data = await getTestimonials(true); // Get only approved testimonials
      setTestimonials(data);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -400 : 400;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitTestimonial({
        name: formState.name,
        role: formState.role,
        content: formState.content,
        rating: formState.rating
      });

      // Send notification email - wrapped in try/catch so database success still shows
      // We don't await this so the UI updates instantly
      sendEmail({
        to_email: 'adamsromeo163@gmail.com', // Send to admin
        from_name: formState.name,
        from_role: formState.role,
        rating: formState.rating,
        message: `
          New Testimonial Submitted:
          
          Name: ${formState.name}
          Role: ${formState.role}
          Rating: ${formState.rating}/5
          
          Content:
          "${formState.content}"
        `
      }).catch(emailError => {
        console.error('Email notification failed but database submission succeeded:', emailError);
      });

      setSubmitStatus('success');
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitStatus('idle');
        setFormState({ name: '', role: '', content: '', rating: 5 });
      }, 3000);
    } catch (error) {
      console.error(error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-32 bg-[#FAFAFA] relative overflow-hidden">
      {/* Sophisticated Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[var(--color-secondary)]/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <Reveal>
            <span className="inline-block py-1 px-3 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-bold uppercase tracking-widest mb-4">
              Testimonials
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display mb-6 text-[var(--color-secondary)] tracking-tight">
              Trusted by <span className="text-[var(--color-primary)]">Homeowners</span> & Businesses
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              We take pride in delivering reliable energy solutions. Here's what our clients have to say about their journey with Lightsup.
            </p>
          </Reveal>
          <Reveal delay={0.3} className="mt-8">
            <Button 
              onClick={() => setIsModalOpen(true)} 
              className="rounded-full px-8 py-6 text-lg shadow-xl shadow-[var(--color-primary)]/20 hover:scale-105 transition-transform"
            >
              <MessageSquare className="h-5 w-5 mr-2" /> Share Your Story
            </Button>
          </Reveal>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] rounded-full animate-spin" />
            </div>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto">
            <MessageSquare className="h-12 w-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="relative group">
            <div 
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 scrollbar-hide px-4 md:px-0"
            >
              {testimonials.map((testimonial, i) => (
                <div key={testimonial.id} className="min-w-[85vw] md:min-w-[450px] snap-center">
                  <motion.div 
                    whileHover={{ y: -4 }}
                    className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-lg shadow-inner">
                          {testimonial.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-base leading-tight">{testimonial.name}</h4>
                          {testimonial.role && (
                            <p className="text-sm text-gray-500 mt-0.5">{testimonial.role}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-0.5 bg-yellow-50 px-2 py-1 rounded-lg border border-yellow-100">
                        {[...Array(5)].map((_, index) => (
                          <Star 
                            key={index} 
                            className={`h-4 w-4 ${index < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} 
                          />
                        ))}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-grow mb-6">
                      <p className="text-gray-600 text-base leading-relaxed italic">
                        "{testimonial.content}"
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="pt-6 border-t border-gray-50 flex items-center justify-between text-xs">
                      <span className="text-gray-400 font-medium">{format(testimonial.createdAt, 'MMMM d, yyyy')}</span>
                      <span className="flex items-center gap-1.5 text-green-700 font-semibold bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Verified Purchase
                      </span>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
            
            {/* Navigation Buttons */}
            <div className="hidden md:flex justify-end gap-4 mt-8 px-4">
              <button 
                onClick={() => scroll('left')}
                className="p-3 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all shadow-sm"
                aria-label="Previous review"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={() => scroll('right')}
                className="p-3 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-[var(--color-primary)] hover:text-white hover:border-[var(--color-primary)] transition-all shadow-sm"
                aria-label="Next review"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="text-xl font-bold font-display text-[var(--color-secondary)]">Share Your Experience</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6">
                {submitStatus === 'success' ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="h-8 w-8 text-green-600" />
                    </div>
                    <h4 className="text-xl font-bold mb-2">Thank You!</h4>
                    <p className="text-gray-600">Your review has been submitted and is pending approval.</p>
                  </div>
                ) : submitStatus === 'error' ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-red-600">!</span>
                    </div>
                    <h4 className="text-xl font-bold mb-2">Something went wrong</h4>
                    <p className="text-gray-600 mb-4">We couldn't submit your review. Please try again.</p>
                    <Button onClick={() => setSubmitStatus('idle')} variant="outline">
                      Try Again
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                      <input
                        required
                        type="text"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role / Location (Optional)</label>
                      <input
                        type="text"
                        value={formState.role}
                        onChange={(e) => setFormState({ ...formState, role: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                        placeholder="Homeowner, Lekki"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFormState({ ...formState, rating: star })}
                            className="focus:outline-none transition-transform hover:scale-110"
                          >
                            <Star 
                              className={`h-8 w-8 ${star <= formState.rating ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                      <textarea
                        required
                        rows={4}
                        value={formState.content}
                        onChange={(e) => setFormState({ ...formState, content: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-primary)] outline-none resize-none"
                        placeholder="Tell us about your experience..."
                      />
                    </div>

                    <Button type="submit" className="w-full mt-2" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" /> Submitting...
                        </>
                      ) : (
                        <>
                          Submit Review <Send className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
