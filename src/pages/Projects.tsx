import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/Button';
import { Reveal } from '@/components/Reveal';
import { Filter, X, MapPin, Zap, Calendar } from 'lucide-react';

// Mock Data
const projects = [
  {
    id: 1,
    title: 'Lekki Phase 1 Luxury Villa',
    category: 'Residential',
    image: 'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?q=80&w=800&auto=format&fit=crop',
    location: 'Lekki, Lagos',
    capacity: '10kW',
    completion: 'Jan 2024',
    description: 'A complete off-grid solution for a 5-bedroom luxury villa, ensuring 24/7 power supply independent of the grid.',
    specs: ['20 x 550W Monocrystalline Panels', '10kW Hybrid Inverter', '20kWh Lithium Battery Bank'],
    outcome: 'Eliminated diesel generator usage, saving ₦450,000 monthly.',
  },
  {
    id: 2,
    title: 'Ikeja Shopping Plaza',
    category: 'Commercial',
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?q=80&w=800&auto=format&fit=crop',
    location: 'Ikeja, Lagos',
    capacity: '50kW',
    completion: 'Nov 2023',
    description: 'Grid-tied solar system to reduce daytime energy costs for a busy shopping complex.',
    specs: ['100 x 500W Panels', '50kW Grid-Tie Inverter', 'Smart Monitoring System'],
    outcome: 'Reduced daytime grid consumption by 70%.',
  },
  {
    id: 3,
    title: 'Aba Manufacturing Plant',
    category: 'Industrial',
    image: 'https://images.unsplash.com/photo-1566093097221-ac2335b09e70?q=80&w=800&auto=format&fit=crop',
    location: 'Aba, Abia',
    capacity: '200kW',
    completion: 'Sep 2023',
    description: 'Large-scale industrial solar installation to power heavy machinery and reduce operational costs.',
    specs: ['400 x 500W Panels', '200kW Industrial Inverter', 'High-Voltage Battery Storage'],
    outcome: 'Stable voltage for machinery and 40% reduction in operational costs.',
  },
  {
    id: 4,
    title: 'Victoria Island Office Complex',
    category: 'Commercial',
    image: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?q=80&w=800&auto=format&fit=crop',
    location: 'VI, Lagos',
    capacity: '30kW',
    completion: 'Feb 2024',
    description: 'Hybrid system for a 3-story office building to ensure uninterrupted internet and cooling.',
    specs: ['60 x 500W Panels', '30kW Hybrid Inverter', '60kWh Battery Bank'],
    outcome: 'Zero downtime during work hours.',
  },
  {
    id: 5,
    title: 'Banana Island Duplex',
    category: 'Residential',
    image: 'https://images.unsplash.com/photo-1621252179027-94459d27d3ee?q=80&w=800&auto=format&fit=crop',
    location: 'Banana Island, Lagos',
    capacity: '15kW',
    completion: 'Dec 2023',
    description: 'Premium aesthetic installation with all-black panels for a modern home.',
    specs: ['30 x 500W All-Black Panels', '15kW Inverter', '30kWh Battery'],
    outcome: 'Seamless integration with home automation.',
  },
  {
    id: 6,
    title: 'Kano Rice Mill',
    category: 'Industrial',
    image: 'https://images.unsplash.com/photo-1548337138-e87d889cc369?q=80&w=800&auto=format&fit=crop',
    location: 'Kano',
    capacity: '150kW',
    completion: 'Oct 2023',
    description: 'Off-grid power solution for an agricultural processing facility in a remote location.',
    specs: ['300 x 500W Panels', '150kW Off-Grid Inverter', 'Generator Sync'],
    outcome: 'Enabled 24-hour production cycles.',
  },
];

const categories = ['All', 'Residential', 'Commercial', 'Industrial'];

export const Projects = () => {
  const [filter, setFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="bg-[var(--color-secondary)] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Reveal width="100%">
              <h1 className="text-4xl md:text-6xl font-bold font-display mb-6">Our Projects</h1>
            </Reveal>
            <Reveal width="100%" delay={0.3}>
              <p className="text-xl text-gray-300">
                Explore our portfolio of successful solar installations across Nigeria.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 md:px-6">
          {/* Filters */}
          <Reveal width="100%">
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    filter === cat
                      ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/30'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Grid */}
          <motion.div 
            layout
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  key={project.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group border border-gray-100"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[var(--color-secondary)] uppercase tracking-wide">
                      {project.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold font-display mb-2 text-[var(--color-secondary)] group-hover:text-[var(--color-primary)] transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {project.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="h-3 w-3" /> {project.capacity}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="bg-white rounded-3xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-64 md:h-96">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                  <div className="inline-block px-3 py-1 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold uppercase tracking-wide mb-3">
                    {selectedProject.category}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold font-display text-white">
                    {selectedProject.title}
                  </h2>
                </div>
              </div>
              
              <div className="p-8 md:p-12">
                <div className="grid md:grid-cols-3 gap-12">
                  <div className="md:col-span-2 space-y-8">
                    <div>
                      <h3 className="text-xl font-bold font-display mb-4 text-[var(--color-secondary)]">Project Overview</h3>
                      <p className="text-gray-600 leading-relaxed">
                        {selectedProject.description}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold font-display mb-4 text-[var(--color-secondary)]">Technical Specifications</h3>
                      <ul className="space-y-2">
                        {selectedProject.specs.map((spec, i) => (
                          <li key={i} className="flex items-center gap-3 text-gray-600">
                            <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                            {spec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold font-display mb-4 text-[var(--color-secondary)]">Outcome</h3>
                      <div className="bg-green-50 border border-green-100 p-6 rounded-xl text-green-800 font-medium">
                        {selectedProject.outcome}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                      <h4 className="font-bold text-gray-900 mb-4">Project Details</h4>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-sm">
                          <MapPin className="h-5 w-5 text-gray-400" />
                          <div>
                            <div className="text-gray-500">Location</div>
                            <div className="font-medium text-gray-900">{selectedProject.location}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Zap className="h-5 w-5 text-gray-400" />
                          <div>
                            <div className="text-gray-500">System Capacity</div>
                            <div className="font-medium text-gray-900">{selectedProject.capacity}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <div>
                            <div className="text-gray-500">Completion Date</div>
                            <div className="font-medium text-gray-900">{selectedProject.completion}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Button href="/contact" className="w-full shadow-lg shadow-[var(--color-primary)]/20">
                      Get Similar Quote
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
