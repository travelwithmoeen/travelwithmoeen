"use client";

import Image from "next/image";
import Link from "next/link";
import { User, Calendar, ArrowRight } from "lucide-react";

const posts = [
  {
    id: 1,
    title: "10 Essential Tips for Solo Travelers in Bali",
    excerpt: "Discover how to navigate the beautiful island of Bali on your own with our comprehensive guide...",
    author: "Sarah Johnson",
    date: "Oct 24, 2025",
    category: "Travel Tips",
    image: "/images/hero.png"
  },
  {
    id: 2,
    title: "The Best Hidden Gems in the Swiss Alps",
    excerpt: "Beyond the popular resorts lie breathtaking valleys and secret villages that will leave you speechless...",
    author: "Marc Dupond",
    date: "Nov 02, 2025",
    category: "Destinations",
    image: "/images/hero.png"
  },
  {
    id: 3,
    title: "What to Pack for Your Next Luxury Cruise",
    excerpt: "Packing for a cruise requires a mix of formal wear and adventure gear. Here is our ultimate list...",
    author: "Emily White",
    date: "Dec 15, 2025",
    category: "Planning",
    image: "/images/hero.png"
  },
  {
    id: 4,
    title: "5 Reasons to Visit Kyoto This Spring",
    excerpt: "Cherry blossoms are just the beginning. Kyoto offers a spiritual journey you won't find anywhere else...",
    author: "Hiroki Tanaka",
    date: "Jan 05, 2026",
    category: "Culture",
    image: "/images/hero.png"
  }
];

export default function BlogPage() {
  return (
    <div className="pt-32 pb-24 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Travel Blog & Stories</h1>
            <p className="text-slate-500 text-lg">
              Insights, tips, and inspiration from our global community of explorers. Learn how to make the most of your next journey.
            </p>
          </div>
          <div className="flex gap-4">
            {["All", "Tips", "Destinations", "News"].map((cat) => (
              <button key={cat} className="px-6 py-2 rounded-full border border-slate-200 text-slate-600 font-bold hover:bg-white hover:border-indigo-600 hover:text-indigo-600 transition-all">
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-[40px] overflow-hidden shadow-xl shadow-slate-200/50 group flex flex-col">
              <div className="relative h-[300px] overflow-hidden">
                <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-6 left-6 bg-white px-4 py-2 rounded-2xl font-bold text-indigo-600 text-sm shadow-md">
                  {post.category}
                </div>
              </div>
              <div className="p-10 flex flex-col flex-1">
                <div className="flex items-center gap-6 text-slate-400 text-sm mb-6">
                  <div className="flex items-center gap-2"><User size={16} /> {post.author}</div>
                  <div className="flex items-center gap-2"><Calendar size={16} /> {post.date}</div>
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors leading-tight">
                  <Link href={`/blog/${post.id}`}>{post.title}</Link>
                </h2>
                <p className="text-slate-500 mb-8 flex-1 leading-relaxed">
                  {post.excerpt}
                </p>
                <Link href={`/blog/${post.id}`} className="flex items-center gap-2 text-indigo-600 font-bold group-hover:gap-4 transition-all">
                  Read Article <ArrowRight size={20} />
                </Link>
              </div>
            </article>
          ))}
        </div>
        
        <div className="mt-20 flex justify-center">
          <button className="px-12 py-5 bg-white border-2 border-slate-100 rounded-3xl font-bold text-slate-900 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-lg hover:shadow-indigo-100">
            Load More Posts
          </button>
        </div>
      </div>
    </div>
  );
}
