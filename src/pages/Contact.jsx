import React, { useState, useRef } from "react";
import { MapPin, Phone, Mail, Send, Loader, MessageCircle } from "lucide-react";
import emailjs from '@emailjs/browser';
import { useToast } from "../context/ToastContext";
import { useSettings } from "../context/SettingsContext";

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useRef();
  const { showToast } = useToast();
  const { settings } = useSettings();

  const storeAddress = settings?.storeAddress || "Wema Complex, Ibadan, Oyo State, Nigeria";
  const storePhone = settings?.storePhone || "+234 907 579 3786";
  const whatsappNumber = settings?.whatsappNumber || "2349075793786";
  const contactEmail = settings?.contactEmail || "support@nikdel.com";
  const operatingHours = settings?.operatingHours || "Mon - Sat: 8:00 AM - 6:00 PM (WAT)";

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const serviceId = "service_ap0twre";
    const templateId = "template_he9wyin";
    const publicKey = "kB2hGEEEYAYTlYaKb";

    emailjs.sendForm(serviceId, templateId, form.current, {
      publicKey: publicKey,
    })
    .then(
      () => {
        setSent(true);
        setLoading(false);
        showToast("Message sent successfully!", "success");
        setTimeout(() => setSent(false), 5000);
        form.current.reset();
      },
      (error) => {
        setLoading(false);
        console.error('FAILED...', error.text);
        showToast("Failed to send message. Please try again.", "error");
      },
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <span className="inline-block bg-brand-50 text-brand-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-brand-200">
          Customer Support & Inquiries
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">Get in Touch</h1>
        <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          Have questions about construction materials, machinery, power tools, or order delivery? We are here to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-2xl border border-slate-100 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mb-4 border border-brand-100">
            <MapPin size={24} />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Our Physical Location</h3>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            {storeAddress}
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-100 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mb-4 border border-brand-100">
            <Phone size={24} />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Phone & WhatsApp</h3>
          <p className="text-sm text-slate-600 leading-relaxed font-medium mb-3">
            <a href={`tel:${storePhone.replace(/\s+/g, '')}`} className="hover:text-brand-600 font-bold transition-colors">
              {storePhone}
            </a>
            <br />
            <span className="text-xs text-slate-400">{operatingHours}</span>
          </p>
          <a
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hello Nikdel, I have an inquiry regarding your products.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-full transition-colors"
          >
            <MessageCircle size={14} /> Chat on WhatsApp
          </a>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-100 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mb-4 border border-brand-100">
            <Mail size={24} />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Direct Email</h3>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            <a href={`mailto:${contactEmail}`} className="hover:text-brand-600 font-bold transition-colors">
              {contactEmail}
            </a>
            <br />
            <span className="text-xs text-slate-400">Response within 24 hours</span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm max-w-3xl mx-auto">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-6 text-center">Send us a Message</h2>
        {sent ? (
          <div className="bg-emerald-50 text-emerald-700 p-6 rounded-2xl text-center font-semibold">
            Thank you for reaching out! Your message has been sent successfully.
          </div>
        ) : (
          <form ref={form} onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Full Name</label>
                <input type="text" name="user_name" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email Address</label>
                <input type="email" name="user_email" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Subject</label>
              <input type="text" name="subject" required className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Message</label>
              <textarea name="message" required rows="5" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"></textarea>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md">
              {loading ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
