import React from "react";
import { Link } from "react-router-dom";

export default function Blog() {
  const posts = [
    {
      id: 1,
      title: "Top 10 Construction Shopping Tips for 2026",
      excerpt: "Learn how to save time and money on your hardware and building materials run with these essential tips.",
      date: "August 24, 2026",
      category: "Lifestyle",
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: 2,
      title: "The Future of E-Commerce Logistics",
      excerpt: "Discover how one-hour delivery is reshaping the retail landscape across the globe.",
      date: "Aug 10, 2026",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: 3,
      title: "Healthy Eating on a Budget",
      excerpt: "Eating healthy doesn't have to break the bank. Explore affordable organic options.",
      date: "Aug 05, 2026",
      category: "Health",
      image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&auto=format&fit=crop&q=60"
    }
  ];

  return (
    <div className="space-y-12">
      <div className="bg-slate-900 rounded-3xl p-12 text-center text-white relative overflow-hidden">
        <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold">NIKDEL Blog</h1>
          <p className="text-slate-300">Insights, news, and tips from the world of e-commerce and daily living.</p>
        </div>
        <div className="absolute inset-0 bg-brand-900/20 mix-blend-overlay"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map(post => (
          <article key={post.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all group">
            <div className="h-48 overflow-hidden">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                <span className="text-brand-600 uppercase tracking-wider">{post.category}</span>
                <span>{post.date}</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-brand-600 transition-colors">
                <Link to="#">{post.title}</Link>
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {post.excerpt}
              </p>
              <Link to="#" className="inline-block text-sm font-bold text-brand-600 hover:text-brand-700 underline underline-offset-4 pt-2">
                Read Full Article
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
