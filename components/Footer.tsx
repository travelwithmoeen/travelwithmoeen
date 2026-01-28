import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin, Compass } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <Link href="/" className="flex items-center space-x-2 text-white">
            <Compass size={28} className="text-indigo-500" />
            <span className="text-2xl font-bold tracking-tight">
              Elite<span className="text-indigo-500">Travel</span>
            </span>
          </Link>
          <p className="text-balance leading-relaxed">
            Discover the world's most breathtaking destinations with Elite Travel. We curate unique experiences that last a lifetime.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white transition-colors"><Facebook size={20} /></a>
            <a href="#" className="hover:text-white transition-colors"><Instagram size={20} /></a>
            <a href="#" className="hover:text-white transition-colors"><Twitter size={20} /></a>
            <a href="#" className="hover:text-white transition-colors"><Youtube size={20} /></a>
          </div>
        </div>

        <div>
          <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
          <ul className="space-y-4">
            <li><Link href="/" className="hover:text-indigo-400 transition-colors">Home</Link></li>
            <li><Link href="/tours" className="hover:text-indigo-400 transition-colors">All Tours</Link></li>
            <li><Link href="/blog" className="hover:text-indigo-400 transition-colors">Travel Blog</Link></li>
            <li><Link href="/about" className="hover:text-indigo-400 transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-indigo-400 transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold text-lg mb-6">Popular Destiantions</h3>
          <ul className="space-y-4">
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Bali, Indonesia</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Santorini, Greece</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Maldives</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Swiss Alps, Switzerland</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition-colors">Kyoto, Japan</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold text-lg mb-6">Contact Us</h3>
          <ul className="space-y-4">
            <li className="flex items-center space-x-3">
              <Phone size={18} className="text-indigo-500" />
              <span>+1 (234) 567-890</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail size={18} className="text-indigo-500" />
              <span>hello@elitetravel.com</span>
            </li>
            <li className="flex items-start space-x-3">
              <MapPin size={18} className="text-indigo-500 mt-1" />
              <span>123 Adventure Way,<br />San Francisco, CA 94103</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-900 flex flex-col md:row justify-between items-center text-sm">
        <p>&copy; {new Date().getFullYear()} Elite Travel. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-white">Privacy Policy</a>
          <a href="#" className="hover:text-white">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
