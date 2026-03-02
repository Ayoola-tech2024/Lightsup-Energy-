import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/Button';
import { Reveal } from '@/components/Reveal';
import { Filter, X, MapPin, Zap, Calendar, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { getProjects, Project } from '@/services/db';
import { format } from 'date-fns';

const categories = ['All', 'Residential', 'Commercial', 'Industrial'];

export const Projects = () => {
  const [filter, setFilter] = useState('All');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.clientType === filter);

  const nextGalleryImage = () => {
    if (selectedProject) {
      const totalImages = [selectedProject.mainImage, ...selectedProject.gallery].length;
      setActiveGalleryIndex((prev) => (prev + 1) % totalImages);
    }
  };

  const prevGalleryImage = () => {
    if (selectedProject) {
      const totalImages = [selectedProject.mainImage, ...selectedProject.gallery].length;
      setActiveGalleryIndex((prev) => (prev - 1 + totalImages) % totalImages);
    }
  };

  const allSelectedImages = selectedProject 
    ? [selectedProject.mainImage, ...selectedProject.gallery] 
    : [];

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
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-[var(--color-primary)]" />
              <p className="text-gray-500 font-medium">Loading our portfolio...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No projects found in this category.</p>
            </div>
          ) : (
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
                    onClick={() => {
                      setSelectedProject(project);
                      setActiveGalleryIndex(0);
                    }}
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={project.mainImage}
                        alt={project.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[var(--color-secondary)] uppercase tracking-wide">
                        {project.clientType}
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
          )}
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
              <div className="relative h-64 md:h-[450px] bg-gray-900">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeGalleryIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    src={allSelectedImages[activeGalleryIndex]}
                    alt={selectedProject.title}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>
                
                {allSelectedImages.length > 1 && (
                  <>
                    <button 
                      onClick={(e) => { e.stopPropagation(); prevGalleryImage(); }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); nextGalleryImage(); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}

                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full text-white transition-colors z-10"
                >
                  <X className="h-6 w-6" />
                </button>
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-8">
                  <div className="inline-block px-3 py-1 rounded-full bg-[var(--color-primary)] text-white text-xs font-bold uppercase tracking-wide mb-3">
                    {selectedProject.clientType}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold font-display text-white">
                    {selectedProject.title}
                  </h2>
                </div>
              </div>

              {/* Gallery Thumbnails */}
              {allSelectedImages.length > 1 && (
                <div className="flex gap-2 p-4 bg-gray-50 overflow-x-auto scrollbar-hide">
                  {allSelectedImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveGalleryIndex(idx)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${activeGalleryIndex === idx ? 'border-[var(--color-primary)] scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
              
              <div className="p-8 md:p-12">
                <div className="grid md:grid-cols-3 gap-12">
                  <div className="md:col-span-2 space-y-8">
                    <div>
                      <h3 className="text-xl font-bold font-display mb-4 text-[var(--color-secondary)]">Project Overview</h3>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {selectedProject.description}
                      </p>
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
                            <div className="font-medium text-gray-900">{format(selectedProject.completionDate, 'MMMM yyyy')}</div>
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
