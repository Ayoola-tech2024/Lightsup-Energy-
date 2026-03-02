import React, { useEffect, useState } from 'react';
import { getProjects, createProject, updateProject, deleteProject, Project } from '@/services/db';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { format } from 'date-fns';
import { Plus, Edit2, Trash2, X, Search, Download, FileText, Loader2, Image as ImageIcon, MapPin, Zap, Calendar, Building2 } from 'lucide-react';
import { Button } from '@/components/Button';
import { motion, AnimatePresence } from 'motion/react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { compressImage } from '@/utils/imageCompression';

export const ProjectManager = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    capacity: '',
    clientType: 'Residential' as 'Residential' | 'Commercial' | 'Industrial',
    completionDate: format(new Date(), 'yyyy-MM-dd'),
    mainImage: '',
    gallery: [] as string[]
  });

  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      location: '',
      capacity: '',
      clientType: 'Residential',
      completionDate: format(new Date(), 'yyyy-MM-dd'),
      mainImage: '',
      gallery: []
    });
    setMainImageFile(null);
    setGalleryFiles([]);
    setIsModalOpen(true);
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      location: project.location,
      capacity: project.capacity,
      clientType: project.clientType,
      completionDate: format(project.completionDate, 'yyyy-MM-dd'),
      mainImage: project.mainImage,
      gallery: project.gallery
    });
    setMainImageFile(null);
    setGalleryFiles([]);
    setIsModalOpen(true);
  };

  const handleDelete = async (project: Project) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(project.id!);
        // Optionally delete images from storage here if needed
        fetchProjects();
      } catch (error) {
        console.error("Error deleting project:", error);
        alert("Failed to delete project. Please try again.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'main' | 'gallery') => {
    if (e.target.files) {
      if (type === 'main') {
        setMainImageFile(e.target.files[0]);
      } else {
        const files = Array.from(e.target.files).slice(0, 5); // Max 5 gallery images
        setGalleryFiles(files);
      }
    }
  };

  const uploadImage = async (file: File, path: string): Promise<string> => {
    const compressedBlob = await compressImage(file);
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, compressedBlob);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let mainImageUrl = formData.mainImage;
      let galleryUrls = [...formData.gallery];

      const projectId = editingProject?.id || `new-${Date.now()}`;

      if (mainImageFile) {
        mainImageUrl = await uploadImage(mainImageFile, `projects/${projectId}/main_${Date.now()}.webp`);
      }

      if (galleryFiles.length > 0) {
        const newGalleryUrls = await Promise.all(
          galleryFiles.map((file, index) => 
            uploadImage(file, `projects/${projectId}/gallery_${index}_${Date.now()}.webp`)
          )
        );
        galleryUrls = [...galleryUrls, ...newGalleryUrls].slice(0, 5);
      }

      const projectData = {
        ...formData,
        mainImage: mainImageUrl,
        gallery: galleryUrls,
        completionDate: new Date(formData.completionDate)
      };

      if (editingProject) {
        await updateProject(editingProject.id!, projectData);
      } else {
        await createProject(projectData);
      }
      setIsModalOpen(false);
      fetchProjects();
    } catch (error) {
      console.error("Error saving project:", error);
      alert("Failed to save project. Check console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const exportCSV = () => {
    const headers = ['Title', 'Location', 'Capacity', 'Client Type', 'Completion Date'];
    const csvContent = [
      headers.join(','),
      ...projects.map(p => [
        `"${p.title.replace(/"/g, '""')}"`,
        `"${p.location}"`,
        `"${p.capacity}"`,
        `"${p.clientType}"`,
        format(p.completionDate, 'yyyy-MM-dd')
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `projects_export_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Projects Portfolio - Lightsup Energy', 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on ${format(new Date(), 'MMM d, yyyy HH:mm')}`, 14, 30);

    const tableColumn = ["Title", "Location", "Capacity", "Client Type", "Date"];
    const tableRows = projects.map(p => [
      p.title,
      p.location,
      p.capacity,
      p.clientType,
      format(p.completionDate, 'MMM d, yyyy')
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [46, 42, 91] }
    });

    doc.save(`projects_export_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col min-h-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900">Projects Portfolio</h1>
          <p className="text-sm text-gray-500">Manage your solar installation showcase.</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button onClick={exportCSV} variant="outline" size="sm" className="gap-2 flex-1 sm:flex-none justify-center rounded-xl">
            <Download className="h-4 w-4" /> CSV
          </Button>
          <Button onClick={exportPDF} variant="outline" size="sm" className="gap-2 flex-1 sm:flex-none justify-center rounded-xl">
            <FileText className="h-4 w-4" /> PDF
          </Button>
          <Button onClick={handleCreate} size="sm" className="gap-2 flex-1 sm:flex-none justify-center rounded-xl shadow-lg shadow-[var(--color-primary)]/20">
            <Plus className="h-4 w-4" /> New Project
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50/50 flex gap-4 shrink-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search projects by title or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent bg-white"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto scrollbar-hide">
          <table className="w-full text-left text-sm min-w-[800px] relative">
            <thead className="bg-gray-50/80 backdrop-blur-sm text-gray-600 font-medium border-b border-gray-200 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Capacity</th>
                <th className="px-6 py-4">Client Type</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-[var(--color-primary)]" />
                    <span>Loading projects...</span>
                  </div>
                </td></tr>
              ) : filteredProjects.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-2">
                    <Search className="h-8 w-8 text-gray-300" />
                    <span>No projects found.</span>
                  </div>
                </td></tr>
              ) : (
                filteredProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                          <img src={project.mainImage} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{project.title}</div>
                          <div className="text-xs text-gray-400">{format(project.completionDate, 'MMM yyyy')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        {project.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div className="flex items-center gap-1">
                        <Zap className="h-3 w-3 text-yellow-500" />
                        {project.capacity}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest
                        ${project.clientType === 'Residential' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 
                          project.clientType === 'Commercial' ? 'bg-purple-50 text-purple-700 border border-purple-100' : 
                          'bg-orange-50 text-orange-700 border border-orange-100'}`}>
                        {project.clientType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleEdit(project)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(project)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h2 className="text-xl font-bold font-display text-gray-900">
                  {editingProject ? 'Edit Project' : 'New Project'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                    <input
                      required
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                      placeholder="e.g., Lekki Phase 1 Luxury Villa"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        required
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                        placeholder="e.g., Lekki, Lagos"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                    <div className="relative">
                      <Zap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        required
                        type="text"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                        placeholder="e.g., 10kW"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Client Type</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <select
                        value={formData.clientType}
                        onChange={(e) => setFormData({ ...formData, clientType: e.target.value as any })}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-primary)] outline-none appearance-none bg-white"
                      >
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Industrial">Industrial</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Completion Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        required
                        type="date"
                        value={formData.completionDate}
                        onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-primary)] outline-none resize-none"
                    placeholder="Describe the project details, components used, and outcomes..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Main Image</label>
                    <div className="flex flex-col gap-4">
                      {formData.mainImage && (
                        <div className="relative w-full h-40 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                          <img src={formData.mainImage} alt="Main" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'main')}
                        className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-primary)]/10 file:text-[var(--color-primary)] hover:file:bg-[var(--color-primary)]/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gallery (Max 5)</label>
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-3 gap-2">
                        {formData.gallery.map((url, i) => (
                          <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                            <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                            <button 
                              type="button"
                              onClick={() => setFormData({ ...formData, gallery: formData.gallery.filter((_, idx) => idx !== i) })}
                              className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'gallery')}
                        className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-primary)]/10 file:text-[var(--color-primary)] hover:file:bg-[var(--color-primary)]/20"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                  <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="gap-2">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        {editingProject ? 'Update Project' : 'Create Project'}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
