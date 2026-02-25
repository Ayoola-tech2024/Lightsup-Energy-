import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Calendar, User, ArrowLeft, Loader2 } from 'lucide-react';
import { getBlogPosts, BlogPost } from '@/services/db';
import { Button } from '@/components/Button';
import ReactMarkdown from 'react-markdown';
import { Reveal } from '@/components/Reveal';

export const BlogPostView = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // In a real app, we'd have a getBlogPostById function
        // For now, we'll fetch all and find the one we need
        const posts = await getBlogPosts(false);
        const foundPost = posts.find(p => p.id === id);
        setPost(foundPost || null);
      } catch (error) {
        console.error("Error fetching blog post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-20">
        <h1 className="text-2xl font-bold text-[var(--color-secondary)] mb-4">Post not found</h1>
        <Button href="/blog" variant="outline">Back to Blog</Button>
      </div>
    );
  }

  return (
    <div className="pt-20 bg-gray-50 min-h-screen pb-20">
      {/* Hero Image */}
      <div className="h-[40vh] md:h-[50vh] relative w-full overflow-hidden">
        <img
          src={post.imageUrl || `https://picsum.photos/seed/${post.id}/1920/1080`}
          alt={post.title}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-10 container mx-auto">
          <Reveal>
            <Link to="/blog" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Blog
            </Link>
          </Reveal>
          <Reveal delay={0.2}>
            <h1 className="text-3xl md:text-5xl font-bold font-display text-white mb-4 leading-tight max-w-4xl">
              {post.title}
            </h1>
          </Reveal>
          <Reveal delay={0.3}>
            <div className="flex items-center gap-6 text-sm text-white/80">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {format(post.createdAt, 'MMMM d, yyyy')}
              </span>
              <span className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {post.author}
              </span>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 -mt-10 relative z-10">
        <Reveal delay={0.4}>
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none prose-headings:font-display prose-headings:text-[var(--color-secondary)] prose-a:text-[var(--color-primary)] prose-img:rounded-xl">
              <ReactMarkdown>{post.content}</ReactMarkdown>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
};
