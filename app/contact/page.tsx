"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Facebook, Instagram, Twitter } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="pt-32 pb-24 h-screen max-h-screen">
      <div className="max-w-7xl mx-auto px-6 h-full flex flex-col">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">Get in Touch</h1>
          <p className="text-slate-500 text-lg max-w-2xl">
            Have questions about our tours or need a custom itinerary? Our travel experts are here to help you plan your perfect trip.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 flex-1 min-h-0">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-indigo-600 rounded-3xl p-8 text-white h-full flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-8">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-white/10 p-3 rounded-xl"><Phone size={24} /></div>
                    <div>
                      <p className="text-indigo-200 text-sm">Call us</p>
                      <p className="font-bold text-lg">+1 (234) 567-890</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-white/10 p-3 rounded-xl"><Mail size={24} /></div>
                    <div>
                      <p className="text-indigo-200 text-sm">Email us</p>
                      <p className="font-bold text-lg">hello@elitetravel.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-white/10 p-3 rounded-xl"><MapPin size={24} /></div>
                    <div>
                      <p className="text-indigo-200 text-sm">Visit us</p>
                      <p className="font-bold text-lg text-pretty">123 Adventure Way, San Francisco, CA</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-12">
                <a href="#" className="bg-white/10 p-4 rounded-2xl hover:bg-white/20 transition-all"><Facebook /></a>
                <a href="#" className="bg-white/10 p-4 rounded-2xl hover:bg-white/20 transition-all"><Instagram /></a>
                <a href="#" className="bg-white/10 p-4 rounded-2xl hover:bg-white/20 transition-all"><Twitter /></a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm overflow-y-auto">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase">First Name</label>
                  <input type="text" placeholder="John" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 uppercase">Last Name</label>
                  <input type="text" placeholder="Doe" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase">Email Address</label>
                <input type="email" placeholder="john@example.com" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase">Subject</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all appearance-none">
                  <option>Inquiry about a Tour</option>
                  <option>Booking Problem</option>
                  <option>Partnership</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase">Message</label>
                <textarea rows={4} placeholder="How can we help you?" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all resize-none"></textarea>
              </div>
              <button className="w-full bg-indigo-600 text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200">
                Send Message <Send size={20} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
