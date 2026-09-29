import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import blogService from "../services/blog.service";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const { currentUser } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    tags: "",
    status: "published",
    coverImage: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tagsArray = formData.tags.split(",").map((t) => t.trim()).filter((t) => t);
      const postData = { ...formData, tags: tagsArray };
      
      await blogService.createPost(postData);
      showToast("Post created successfully", "success");
      setIsModalOpen(false);
      
      // refresh posts
      const data = await blogService.getPosts();
      setPosts(data.data || []);
      
      setFormData({ title: "", content: "", excerpt: "", tags: "", status: "published", coverImage: "" });
    } catch (error) {
      console.error("Error saving post:", error);
      showToast("Failed to create post", "error");
    }
  };

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
        <div className="relative z-10 space-y-6 max-w-2xl mx-auto flex flex-col items-center">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold">NIKDEL Blog</h1>
            <p className="text-slate-300">Insights, news, and tips from the world of e-commerce and daily living.</p>
          </div>
          {currentUser && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-transform hover:-translate-y-1"
            >
              Write a Post
            </button>
          )}
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

      {/* Add Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-slate-900">Write New Post</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                  <textarea
                    name="content"
                    required
                    rows="6"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Write your article content here..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Excerpt (Short description)</label>
                  <textarea
                    name="excerpt"
                    rows="2"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cover Image URL</label>
                  <input
                    type="url"
                    name="coverImage"
                    value={formData.coverImage}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="e.g. News, Tools"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-slate-600 font-medium hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-xl transition-colors shadow-sm shadow-brand-500/20"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
