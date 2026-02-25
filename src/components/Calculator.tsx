import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './Button';
import { Sun, Battery, Zap, DollarSign } from 'lucide-react';

export const Calculator = () => {
  const [monthlyBill, setMonthlyBill] = useState<number>(50000);
  const [sunHours, setSunHours] = useState<number>(5); // Average peak sun hours in Nigeria
  
  // Constants for calculation (simplified for demo)
  const COST_PER_KWH_GRID = 70; // Naira per kWh
  const SYSTEM_COST_PER_KW = 800000; // Naira per kW installed
  
  const calculateSavings = () => {
    const monthlyKwh = monthlyBill / COST_PER_KWH_GRID;
    const dailyKwh = monthlyKwh / 30;
    const requiredSystemSize = dailyKwh / sunHours;
    const systemSize = Math.ceil(requiredSystemSize * 10) / 10; // Round to 1 decimal
    
    const estimatedCost = systemSize * SYSTEM_COST_PER_KW;
    const monthlySavings = monthlyBill * 0.9; // Assuming 90% offset
    const paybackMonths = estimatedCost / monthlySavings;
    const paybackYears = (paybackMonths / 12).toFixed(1);
    
    return {
      systemSize,
      estimatedCost,
      monthlySavings,
      paybackYears
    };
  };

  const results = calculateSavings();

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-[var(--color-primary)] p-6 text-white text-center">
        <h3 className="text-2xl font-bold font-display mb-2">Solar Savings Calculator</h3>
        <p className="opacity-90">Estimate your system size and savings instantly.</p>
      </div>
      
      <div className="p-8 grid md:grid-cols-2 gap-12">
        {/* Inputs */}
        <div className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Electricity Bill (₦)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">₦</span>
              <input
                type="number"
                value={monthlyBill}
                onChange={(e) => setMonthlyBill(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                min="0"
                step="1000"
              />
            </div>
            <input
              type="range"
              min="5000"
              max="500000"
              step="5000"
              value={monthlyBill}
              onChange={(e) => setMonthlyBill(Number(e.target.value))}
              className="w-full mt-4 accent-[var(--color-primary)]"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>₦5k</span>
              <span>₦500k+</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Daily Sun Hours (Average)
            </label>
            <div className="flex items-center gap-4">
              <Sun className="text-yellow-500 h-5 w-5" />
              <input
                type="range"
                min="3"
                max="8"
                step="0.5"
                value={sunHours}
                onChange={(e) => setSunHours(Number(e.target.value))}
                className="w-full accent-yellow-500"
              />
              <span className="font-mono font-bold w-12 text-right">{sunHours}h</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Nigeria averages 4-7 peak sun hours daily.</p>
          </div>
        </div>

        {/* Results */}
        <div className="bg-gray-50 rounded-xl p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Recommended System Size</p>
              <p className="text-2xl font-bold text-gray-900">{results.systemSize} kW</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg text-green-600">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Est. Monthly Savings</p>
              <p className="text-2xl font-bold text-gray-900">₦{results.monthlySavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-yellow-100 p-3 rounded-lg text-yellow-600">
              <Battery className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Est. Payback Period</p>
              <p className="text-2xl font-bold text-gray-900">{results.paybackYears} Years</p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <Button className="w-full" size="lg">
              Get a Detailed Quote
            </Button>
            <p className="text-xs text-center text-gray-400 mt-3">
              *Estimates only. Actual savings may vary based on usage and location.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
