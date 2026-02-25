import React, { useEffect, useState } from 'react';
import { getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost, seedInitialBlogs, BlogPost } from '@/services/db';
import { format } from 'date-fns';
import { Plus, Edit2, Trash2, X, Check, Search, Database, Download, FileText } from 'lucide-react';
import { Button } from '@/components/Button';
import { motion, AnimatePresence } from 'motion/react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const BlogManager = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    author: 'Lightsup Team',
    imageUrl: '',
    published: true
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await getBlogPosts(false); // Get all posts, including unpublished
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeed = async () => {
    if (window.confirm('This will add sample blog posts to your database. Continue?')) {
      setLoading(true);
      await seedInitialBlogs();
      await fetchPosts();
    }
  };

  const handleCreate = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      author: 'Lightsup Team',
      imageUrl: '',
      published: true
    });
    setIsModalOpen(true);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      imageUrl: post.imageUrl || '',
      published: post.published
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deleteBlogPost(id);
        fetchPosts();
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Failed to delete post. Please try again.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPost) {
        await updateBlogPost(editingPost.id!, formData);
      } else {
        await createBlogPost(formData);
      }
      setIsModalOpen(false);
      fetchPosts();
    } catch (error) {
      console.error("Error saving post:", error);
    }
  };

  const exportCSV = () => {
    const headers = ['Title', 'Author', 'Date', 'Status', 'Excerpt'];
    const csvContent = [
      headers.join(','),
      ...posts.map(p => [
        `"${p.title.replace(/"/g, '""')}"`,
        `"${p.author}"`,
        format(p.createdAt, 'yyyy-MM-dd'),
        p.published ? 'Published' : 'Draft',
        `"${p.excerpt.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `blog_posts_export_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Blog Posts - Lightsup Energy', 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated on ${format(new Date(), 'MMM d, yyyy HH:mm')}`, 14, 30);

    const tableColumn = ["Title", "Author", "Date", "Status"];
    const tableRows = posts.map(post => [
      post.title,
      post.author,
      format(post.createdAt, 'MMM d, yyyy'),
      post.published ? 'Published' : 'Draft'
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [46, 42, 91] } // Dark Indigo
    });

    doc.save(`blog_posts_export_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900">Blog Posts</h1>
          <p className="text-gray-500">Create and manage your blog content.</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full xl:w-auto">
          {posts.length === 0 && (
            <Button onClick={handleSeed} variant="outline" className="gap-2 flex-1 sm:flex-none justify-center">
              <Database className="h-4 w-4" /> Seed Data
            </Button>
          )}
          <Button onClick={exportCSV} variant="outline" className="gap-2 flex-1 sm:flex-none justify-center">
            <Download className="h-4 w-4" /> <span className="hidden sm:inline">CSV</span>
          </Button>
          <Button onClick={exportPDF} variant="outline" className="gap-2 flex-1 sm:flex-none justify-center">
            <FileText className="h-4 w-4" /> <span className="hidden sm:inline">PDF</span>
          </Button>
          <Button onClick={handleCreate} className="gap-2 flex-1 sm:flex-none justify-center">
            <Plus className="h-4 w-4" /> New Post
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm min-w-[800px]">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Author</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading posts...</td></tr>
              ) : filteredPosts.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No posts found.</td></tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{post.title}</td>
                    <td className="px-6 py-4 text-gray-600">{post.author}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {format(post.createdAt, 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${post.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(post)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(post.id!)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
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
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                <h2 className="text-xl font-bold font-display text-gray-900">
                  {editingPost ? 'Edit Post' : 'New Post'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                  <textarea
                    required
                    rows={2}
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea
                    required
                    rows={8}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none resize-none font-mono text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                  />
                  <label htmlFor="published" className="text-sm font-medium text-gray-700">Publish immediately</label>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                  <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingPost ? 'Update Post' : 'Create Post'}
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
