import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { LayoutDashboard, FileText, MessageSquare, LogOut, Menu, X, Loader2, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from '@/components/Logo';

export const AdminLayout = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Safety timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (loading) {
        setLoading(false);
        if (!user) navigate('/admin/login');
      }
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      clearTimeout(timeout);
      if (!currentUser) {
        navigate('/admin/login');
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });
    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-[var(--color-primary)] mb-4" />
        <p className="text-gray-600 font-medium">Verifying Administrator Session...</p>
        <p className="text-gray-400 text-sm mt-2">This usually takes a few seconds.</p>
      </div>
    );
  }
  if (!user) return null;

  const navItems = [
    { name: 'Quote Requests', href: '/admin/quotes', icon: MessageSquare },
    { name: 'Blog Posts', href: '/admin/blogs', icon: FileText },
    { name: 'Testimonials', href: '/admin/testimonials', icon: Star },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Logo className="h-8" />
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500">
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.href
                    ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-100 space-y-2">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 w-full transition-colors"
            >
              <LogOut className="h-5 w-5 rotate-180" />
              Back to Website
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 py-4 px-6 lg:hidden flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="h-8" />
          </div>
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
            <Menu className="h-6 w-6" />
          </button>
        </header>

        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};
