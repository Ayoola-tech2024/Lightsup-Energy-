import React, { useState, useEffect } from 'react';
import { getTestimonials, updateTestimonialStatus, deleteTestimonial, Testimonial } from '@/services/db';
import { format } from 'date-fns';
import { Star, Check, X, Trash2, MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/Button';

export const TestimonialsManager = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const data = await getTestimonials(false); // Get all testimonials
      setTestimonials(data);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    setActionLoading(id);
    try {
      await updateTestimonialStatus(id, !currentStatus);
      await fetchTestimonials();
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    
    setActionLoading(id);
    try {
      await deleteTestimonial(id);
      await fetchTestimonials();
    } catch (error) {
      console.error("Error deleting testimonial:", error);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Testimonials Management</h1>
          <p className="text-sm text-gray-500">Approve or remove customer reviews displayed on the website.</p>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide pr-2">
        {testimonials.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No testimonials found</h3>
            <p className="text-gray-500">When customers submit reviews, they will appear here.</p>
          </div>
        ) : (
          <div className="grid gap-4 pb-4">
            {testimonials.map((t) => (
              <div 
                key={t.id} 
                className={`bg-white rounded-2xl p-6 border transition-all duration-300 ${
                  t.approved ? 'border-emerald-100 bg-emerald-50/10' : 'border-gray-200 hover:border-[var(--color-primary)]/30'
                }`}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${i < t.rating ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                        {format(t.createdAt, 'MMM d, yyyy')}
                      </span>
                      {!t.approved && (
                        <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Pending
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-700 mb-6 italic leading-relaxed">"{t.content}"</p>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold border border-gray-200">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{t.name}</div>
                        {t.role && <div className="text-xs text-gray-500">{t.role}</div>}
                      </div>
                    </div>
                  </div>

                  <div className="flex md:flex-col justify-end gap-2 min-w-[140px]">
                    <Button
                      size="sm"
                      variant={t.approved ? "outline" : "primary"}
                      className="w-full gap-2 rounded-xl"
                      onClick={() => handleToggleStatus(t.id!, t.approved)}
                      disabled={actionLoading === t.id}
                    >
                      {actionLoading === t.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : t.approved ? (
                        <><X className="h-4 w-4" /> Unapprove</>
                      ) : (
                        <><Check className="h-4 w-4" /> Approve</>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full gap-2 text-red-600 hover:bg-red-50 border-red-100 rounded-xl"
                      onClick={() => handleDelete(t.id!)}
                      disabled={actionLoading === t.id}
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
