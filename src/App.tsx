import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Home } from '@/pages/Home';
import { Services } from '@/pages/Services';
import { Projects } from '@/pages/Projects';
import { AboutContact } from '@/pages/AboutContact';
import { Login } from '@/pages/admin/Login';
import { AdminLayout } from '@/pages/admin/AdminLayout';
import { Quotes } from '@/pages/admin/Quotes';
import { BlogManager } from '@/pages/admin/BlogManager';
import { ProjectManager } from '@/pages/admin/ProjectManager';
import { TestimonialsManager } from '@/pages/admin/TestimonialsManager';
import { Blog } from '@/pages/Blog';
import { BlogPostView } from '@/pages/BlogPost';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="services" element={<Services />} />
            <Route path="projects" element={<Projects />} />
            <Route path="contact" element={<AboutContact />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:id" element={<BlogPostView />} />
            {/* Fallback route */}
            <Route path="*" element={<Home />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Quotes />} /> {/* Default to dashboard/quotes */}
            <Route path="dashboard" element={<Quotes />} />
            <Route path="quotes" element={<Quotes />} />
            <Route path="blogs" element={<BlogManager />} />
            <Route path="projects" element={<ProjectManager />} />
            <Route path="testimonials" element={<TestimonialsManager />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
