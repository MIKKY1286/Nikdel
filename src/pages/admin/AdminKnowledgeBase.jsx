import React from "react";
import { Search, Book, FileText, Video, ExternalLink } from "lucide-react";

export default function AdminKnowledgeBase() {
  const articles = [
    { title: "Getting Started with your Dashboard", type: "article", icon: <FileText size={18} /> },
    { title: "How to Manage Products and Inventory", type: "video", icon: <Video size={18} /> },
    { title: "Setting up Payment Gateways", type: "article", icon: <FileText size={18} /> },
    { title: "Understanding Analytics and Reports", type: "article", icon: <FileText size={18} /> },
    { title: "Customizing your Storefront", type: "video", icon: <Video size={18} /> },
    { title: "Managing Customer Accounts and Permissions", type: "article", icon: <FileText size={18} /> },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Knowledge Base</h1>
          <p className="text-sm text-slate-500 mt-1">Help and documentation for managing your store.</p>
        </div>
      </div>

      <div className="bg-brand-600 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <Book size={48} className="text-white/80 mx-auto mb-6" />
          <h2 className="text-3xl font-extrabold text-white mb-4">How can we help you today?</h2>
          <div className="relative mt-6">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search documentation, articles, and tutorials..."
              className="w-full bg-white rounded-2xl py-4 pl-12 pr-6 text-slate-900 shadow-xl focus:outline-none focus:ring-4 focus:ring-brand-500/30 transition-all font-medium"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <h3 className="font-extrabold text-lg text-slate-900 mb-4 flex items-center gap-2">
            <FileText size={20} className="text-brand-500" />
            Popular Articles
          </h3>
          <ul className="space-y-3">
            {articles.filter(a => a.type === 'article').map((article, idx) => (
              <li key={idx}>
                <a href="#" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-brand-600 transition-colors font-medium text-sm group">
                  <div className="text-slate-400 group-hover:text-brand-500 transition-colors">{article.icon}</div>
                  {article.title}
                  <ExternalLink size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <h3 className="font-extrabold text-lg text-slate-900 mb-4 flex items-center gap-2">
            <Video size={20} className="text-rose-500" />
            Video Tutorials
          </h3>
          <ul className="space-y-3">
            {articles.filter(a => a.type === 'video').map((article, idx) => (
              <li key={idx}>
                <a href="#" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-rose-600 transition-colors font-medium text-sm group">
                  <div className="text-slate-400 group-hover:text-rose-500 transition-colors">{article.icon}</div>
                  {article.title}
                  <ExternalLink size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
