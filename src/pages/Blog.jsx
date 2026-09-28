import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import blogService from "../services/blog.service";
import { useToast } from "../context/ToastContext";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await blogService.getPosts();
        setPosts(data.data || []);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        showToast("Failed to load blog posts.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [showToast]);

  return (
    <div className="space-y-12">
      <div className="bg-slate-900 rounded-3xl p-12 text-center text-white relative overflow-hidden">
        <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold">NIKDEL Blog</h1>
          <p className="text-slate-300">Insights, news, and tips from the world of e-commerce and daily living.</p>
        </div>
        <div className="absolute inset-0 bg-brand-900/20 mix-blend-overlay"></div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No Posts Yet</h2>
          <p className="text-slate-500">Check back later for exciting news and updates.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <article key={post._id || post.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all group flex flex-col">
              <div className="h-48 overflow-hidden bg-slate-100">
                <img 
                  src={post.coverImage && post.coverImage !== 'no-photo.jpg' ? post.coverImage : 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=60'} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              <div className="p-6 space-y-4 flex flex-col flex-grow">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span className="text-brand-600 uppercase tracking-wider">{post.tags?.[0] || 'Updates'}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-brand-600 transition-colors">
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed flex-grow">
                  {post.excerpt || post.content.substring(0, 120) + '...'}
                </p>
                <Link to={`/blog/${post.slug}`} className="inline-block text-sm font-bold text-brand-600 hover:text-brand-700 underline underline-offset-4 pt-2">
                  Read Full Article
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
