import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import blogService from "../services/blog.service";
import { useToast } from "../context/ToastContext";
import { ArrowLeft } from "lucide-react";

export default function BlogPostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await blogService.getPost(slug);
        setPost(data.data);
      } catch (error) {
        console.error("Error fetching post:", error);
        showToast("Article not found or you are not authorized to view it.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, showToast]);

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-32">
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Article Not Found</h1>
        <p className="text-slate-500 mb-8">The blog post you're looking for doesn't exist.</p>
        <Link to="/blog" className="text-brand-600 font-bold hover:underline">
          &larr; Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto space-y-8 bg-white p-6 sm:p-12 rounded-3xl border border-slate-100 shadow-sm mt-8">
      <Link to="/blog" className="inline-flex items-center text-sm font-bold text-brand-600 hover:text-brand-800 transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Back to all articles
      </Link>

      <header className="space-y-6 text-center pt-8 pb-4">
        <div className="flex items-center justify-center gap-4 text-sm font-semibold text-slate-500">
          <span className="text-brand-600 uppercase tracking-wider bg-brand-50 px-3 py-1 rounded-full">{post.tags?.[0] || 'Updates'}</span>
          <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 leading-tight">
          {post.title}
        </h1>
        {post.status === 'draft' && (
          <div className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mt-4">
            Draft Preview (Admin Only)
          </div>
        )}
      </header>

      {post.coverImage && post.coverImage !== 'no-photo.jpg' && (
        <div className="w-full h-64 sm:h-[400px] rounded-2xl overflow-hidden shadow-md">
          <img 
            src={post.coverImage} 
            alt={post.title} 
            className="w-full h-full object-cover" 
          />
        </div>
      )}

      <div className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-a:text-brand-600 hover:prose-a:text-brand-800 mt-12 whitespace-pre-wrap">
        {post.content}
      </div>

      <div className="border-t border-slate-200 mt-16 pt-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold text-xl">
            {(post.author?.firstName?.[0] || 'A').toUpperCase()}
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Written by</p>
            <p className="font-bold text-slate-900">{post.author?.firstName || 'Admin'} {post.author?.lastName || ''}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
