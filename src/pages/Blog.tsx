import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, User, ArrowRight, Loader2 } from 'lucide-react';
import { getBlogPosts, BlogPost } from '@/services/db';
import { Reveal } from '@/components/Reveal';
import { motion } from 'motion/react';

export const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getBlogPosts(true);
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="bg-[var(--color-secondary)] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Reveal width="100%">
              <h1 className="text-4xl md:text-6xl font-bold font-display mb-6">Latest Insights</h1>
            </Reveal>
            <Reveal width="100%" delay={0.3}>
              <p className="text-xl text-gray-300">
                News, tips, and updates from the world of renewable energy.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-20 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 md:px-6">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No blog posts found yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <Reveal key={post.id} delay={index * 0.1}>
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col h-full"
                  >
                    <Link to={`/blog/${post.id}`} className="block relative h-56 overflow-hidden group">
                      <img
                        src={post.imageUrl || `https://picsum.photos/seed/${post.id}/800/600`}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    </Link>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(post.createdAt, 'MMM d, yyyy')}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {post.author}
                        </span>
                      </div>
                      <Link to={`/blog/${post.id}`} className="block mb-3">
                        <h2 className="text-xl font-bold font-display text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                          {post.title}
                        </h2>
                      </Link>
                      <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow">
                        {post.excerpt}
                      </p>
                      <Link 
                        to={`/blog/${post.id}`}
                        className="text-[var(--color-primary)] font-medium text-sm inline-flex items-center gap-1 hover:gap-2 transition-all mt-auto"
                      >
                        Read Article <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
