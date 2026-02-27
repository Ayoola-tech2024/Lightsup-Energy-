import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/Button';
import { Reveal } from '@/components/Reveal';
import { Plus, Trash2, Calculator, Sun, Battery, Zap, Send, Check, Loader2, Info, X } from 'lucide-react';
import { submitQuote } from '@/services/db';
import { sendEmail } from '@/services/emailService';

type Appliance = {
  id: string;
  name: string;
  watts: number;
  quantity: number;
  hours: number;
};

const commonAppliances = [
  { name: 'LED Bulb', watts: 10 },
  { name: 'Ceiling Fan', watts: 75 },
  { name: 'Standing Fan', watts: 50 },
  { name: 'TV (LED 42")', watts: 80 },
  { name: 'Laptop', watts: 65 },
  { name: 'Refrigerator (Medium)', watts: 150 },
  { name: 'Deep Freezer', watts: 200 },
  { name: 'Air Conditioner (1HP)', watts: 1000 },
  { name: 'Air Conditioner (1.5HP)', watts: 1500 },
  { name: 'Washing Machine', watts: 500 },
  { name: 'Microwave', watts: 1000 },
  { name: 'Water Pump (1HP)', watts: 750 },
  { name: 'Phone Charger', watts: 10 },
  { name: 'Decoder/Sound System', watts: 50 },
];

export const SolarCalculator = () => {
  const [appliances, setAppliances] = useState<Appliance[]>([
    { id: '1', name: 'LED Bulb', watts: 10, quantity: 4, hours: 6 },
    { id: '2', name: 'Ceiling Fan', watts: 75, quantity: 2, hours: 8 },
    { id: '3', name: 'TV (LED 42")', watts: 80, quantity: 1, hours: 4 },
  ]);

  const [results, setResults] = useState({
    totalLoad: 0,
    dailyEnergy: 0,
    inverterSize: 0,
    batteryCapacity: 0,
    panelCapacity: 0,
    panelCount: 0,
  });

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const [isAddDropdownOpen, setIsAddDropdownOpen] = useState(false);

  useEffect(() => {
    calculateSystem();
  }, [appliances]);

  const addAppliance = (template?: typeof commonAppliances[0]) => {
    const newAppliance: Appliance = {
      id: Math.random().toString(36).substr(2, 9),
      name: template ? template.name : 'New Appliance',
      watts: template ? template.watts : 100,
      quantity: 1,
      hours: 4,
    };
    setAppliances([...appliances, newAppliance]);
  };

  const updateAppliance = (id: string, field: keyof Appliance, value: string | number) => {
    setAppliances(appliances.map(app => 
      app.id === id ? { ...app, [field]: value } : app
    ));
  };

  const removeAppliance = (id: string) => {
    setAppliances(appliances.filter(app => app.id !== id));
  };

  const calculateSystem = () => {
    let totalLoad = 0;
    let dailyEnergy = 0;

    appliances.forEach(app => {
      totalLoad += app.watts * app.quantity;
      dailyEnergy += app.watts * app.quantity * app.hours;
    });

    const inverterSize = Math.ceil((totalLoad * 1.25) / 500) * 500;
    const batteryCapacity = Math.ceil(dailyEnergy / 24 / 0.5);
    const panelCapacity = Math.ceil(dailyEnergy / 4.5 / 0.75);
    const panelCount = Math.ceil(panelCapacity / 450);

    setResults({
      totalLoad,
      dailyEnergy,
      inverterSize: Math.max(inverterSize, 1000),
      batteryCapacity,
      panelCapacity,
      panelCount: Math.max(panelCount, 2),
    });
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const systemDetails = JSON.stringify({
      appliances,
      results
    });

    try {
      await submitQuote({
        name: formState.name,
        phone: formState.phone,
        email: formState.email,
        service: 'Solar Calculator Order',
        message: `Custom System Order:\n${formState.message}\n\nAddress: ${formState.address}`,
        systemDetails
      });

      // Send confirmation email - wrapped in try/catch so database success still shows
      try {
        await sendEmail({
          to_email: 'adamsromeo163@gmail.com', // Always send to admin
          from_name: formState.name,
          from_email: formState.email,
          from_phone: formState.phone,
          message: `
            New Solar System Order:
            
            Name: ${formState.name}
            Phone: ${formState.phone}
            Email: ${formState.email}
            Address: ${formState.address}
            
            System Details:
            Total Load: ${results.totalLoad}W
            Daily Energy: ${(results.dailyEnergy / 1000).toFixed(2)}kWh
            Inverter: ${(results.inverterSize / 1000).toFixed(1)}kVA
            Battery: ${results.batteryCapacity}Ah
            Panels: ${results.panelCount} x 450W
            
            Appliances:
            ${appliances.map(app => `- ${app.name} (${app.watts}W x ${app.quantity})`).join('\n')}
            
            Additional Notes:
            ${formState.message}
          `
        });
      } catch (emailError) {
        console.error('Email notification failed but database submission succeeded:', emailError);
      }

      setSubmitStatus('success');
      setTimeout(() => {
        setIsOrderModalOpen(false);
        setSubmitStatus('idle');
        setFormState({ name: '', phone: '', email: '', address: '', message: '' });
      }, 3000);
    } catch (error) {
      console.error(error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Calculator Input */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold font-display text-gray-800 flex items-center gap-2">
                <Zap className="h-5 w-5 text-[var(--color-primary)]" /> Your Appliances
              </h2>
              <div className="relative">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => setIsAddDropdownOpen(!isAddDropdownOpen)}
                >
                  <Plus className="h-4 w-4" /> Add Appliance
                </Button>
                <AnimatePresence>
                  {isAddDropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsAddDropdownOpen(false)} 
                      />
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-2 z-20 max-h-80 overflow-y-auto"
                      >
                        {commonAppliances.map((app, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              addAppliance(app);
                              setIsAddDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-700 flex justify-between items-center"
                          >
                            {app.name} <span className="text-gray-400 text-xs">{app.watts}W</span>
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="space-y-4">
              {appliances.map((app) => (
                <motion.div 
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-12 gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-100"
                >
                  <div className="col-span-12 sm:col-span-4">
                    <label className="text-xs text-gray-500 mb-1 block sm:hidden">Appliance Name</label>
                    <input
                      type="text"
                      value={app.name}
                      onChange={(e) => updateAppliance(app.id, 'name', e.target.value)}
                      className="w-full bg-transparent border-none focus:ring-0 font-medium text-gray-900 p-2 sm:p-0"
                      placeholder="Appliance Name"
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <label className="text-xs text-gray-500 mb-1 block">Watts</label>
                    <input
                      type="number"
                      min="0"
                      value={app.watts}
                      onChange={(e) => updateAppliance(app.id, 'watts', parseInt(e.target.value) || 0)}
                      className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-sm"
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <label className="text-xs text-gray-500 mb-1 block">Qty</label>
                    <input
                      type="number"
                      min="1"
                      value={app.quantity}
                      onChange={(e) => updateAppliance(app.id, 'quantity', parseInt(e.target.value) || 1)}
                      className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-sm"
                    />
                  </div>
                  <div className="col-span-3 sm:col-span-3">
                    <label className="text-xs text-gray-500 mb-1 block">Hours/Day</label>
                    <input
                      type="number"
                      min="0"
                      max="24"
                      value={app.hours}
                      onChange={(e) => updateAppliance(app.id, 'hours', parseInt(e.target.value) || 0)}
                      className="w-full bg-white border border-gray-200 rounded px-2 py-1 text-sm"
                    />
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button 
                      onClick={() => removeAppliance(app.id)}
                      className="text-red-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {appliances.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <p>No appliances added yet. Click "Add Appliance" to start.</p>
              </div>
            )}
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-1">
          <div className="bg-[var(--color-secondary)] text-white p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-bold font-display mb-6 flex items-center gap-2">
              <Calculator className="h-5 w-5 text-[var(--color-primary)]" /> System Estimate
            </h2>

            <div className="space-y-6">
              <div className="bg-white/10 p-4 rounded-xl">
                <div className="text-sm text-gray-300 mb-1">Total Load</div>
                <div className="text-2xl font-bold">{results.totalLoad.toLocaleString()} Watts</div>
              </div>

              <div className="bg-white/10 p-4 rounded-xl">
                <div className="text-sm text-gray-300 mb-1">Daily Energy Needs</div>
                <div className="text-2xl font-bold">{(results.dailyEnergy / 1000).toFixed(2)} kWh</div>
              </div>

              <div className="border-t border-white/10 pt-6 space-y-4">
                <h3 className="font-bold text-[var(--color-primary)]">Recommended System</h3>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-300">Inverter Size</div>
                    <div className="font-bold">{(results.inverterSize / 1000).toFixed(1)} kVA</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Battery className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-300">Battery Bank (24V)</div>
                    <div className="font-bold">{results.batteryCapacity} Ah</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <Sun className="h-5 w-5 text-orange-400" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-300">Solar Panels (450W)</div>
                    <div className="font-bold">{results.panelCount} Panels</div>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setIsOrderModalOpen(true)} 
                className="w-full mt-6 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] text-white border-none"
              >
                Order This System
              </Button>
              <p className="text-xs text-center text-gray-400 mt-2">
                *Estimates only. Final design may vary based on site conditions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Modal */}
      <AnimatePresence>
        {isOrderModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <h2 className="text-xl font-bold font-display text-gray-900">
                  Request System Quote
                </h2>
                <button onClick={() => setIsOrderModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {submitStatus === 'success' ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Request Sent!</h3>
                  <p className="text-gray-600">We've received your system configuration. Our team will review it and contact you shortly with a formal quote.</p>
                </div>
              ) : submitStatus === 'error' ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-red-600">!</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Submission Failed</h3>
                  <p className="text-gray-600 mb-4">We couldn't send your request. Please check your connection and try again.</p>
                  <Button onClick={() => setSubmitStatus('idle')} variant="outline">
                    Try Again
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleOrderSubmit} className="p-6 space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 mb-4 flex gap-2">
                    <Info className="h-5 w-5 shrink-0" />
                    <p>We'll use your calculated system requirements to prepare a custom quote for you.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      required
                      type="text"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      required
                      type="tel"
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      required
                      type="email"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Installation Address</label>
                    <textarea
                      required
                      rows={2}
                      value={formState.address}
                      onChange={(e) => setFormState({ ...formState, address: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-primary)] outline-none resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                    <textarea
                      rows={3}
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-primary)] outline-none resize-none"
                      placeholder="Any specific requirements?"
                    />
                  </div>

                  <div className="pt-4">
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" /> Sending...
                        </>
                      ) : (
                        <>
                          Submit Request <Send className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
