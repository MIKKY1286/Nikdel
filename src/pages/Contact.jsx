import React, { useState } from "react";
import { MapPin, Phone, Mail, Send } from "lucide-react";

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900">Get in Touch</h1>
        <p className="text-slate-500 max-w-xl mx-auto">
          Have a question about your order, our products, or just want to say hi? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-100 flex flex-col items-center text-center shadow-sm">
          <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mb-4">
            <MapPin size={24} />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Our Office</h3>
          <p className="text-sm text-slate-500">123 Commerce Avenue, Suite 400<br/>New York, NY 10001</p>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-slate-100 flex flex-col items-center text-center shadow-sm">
          <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mb-4">
            <Phone size={24} />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Phone</h3>
          <p className="text-sm text-slate-500">+1 (800) 555-0199<br/>Mon-Fri 9am to 6pm EST</p>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-slate-100 flex flex-col items-center text-center shadow-sm">
          <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mb-4">
            <Mail size={24} />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Email</h3>
          <p className="text-sm text-slate-500">support@nikdel.com<br/>We reply within 24 hours</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm max-w-3xl mx-auto">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-6 text-center">Send us a Message</h2>
        {sent ? (
          <div className="bg-emerald-50 text-emerald-700 p-6 rounded-2xl text-center font-semibold">
            Thank you for reaching out! Your message has been sent successfully.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Full Name</label>
                <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email Address</label>
                <input type="email" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Subject</label>
              <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Message</label>
              <textarea required rows="5" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"></textarea>
            </div>
            <button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md">
              <Send size={18} />
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
