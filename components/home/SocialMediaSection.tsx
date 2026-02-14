"use client";
import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Facebook, Instagram, Youtube } from "lucide-react";

// Counter component for animated stats
const CounterStat = ({
  end,
  suffix = "",
  decimals = 0,
}: {
  end: number;
  suffix?: string;
  decimals?: number;
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
    const increment = end / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, end]);

  return (
    <span ref={ref} className="text-3xl font-bold text-foreground md:text-4xl">
      {decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}
      {suffix}
    </span>
  );
};

const socials = [
  {
    name: "YouTube",
    icon: Youtube,
    followersNum: 26.8,
    followersSuffix: "K+",
    decimals: 1,
    page: "Travel with Moeen",
    url: "https://www.youtube.com/@itsmoeen",
    color: "text-red-500",
    bg: "bg-red-500/10",
    hoverBg: "hover:bg-red-500/20",
  },
  {
    name: "Facebook",
    icon: Facebook,
    followersNum: 535,
    followersSuffix: "k+",
    decimals: 0,
    page: "Travel with Moeen",
    url: "https://www.facebook.com/TravelwithMoeen?mibextid=rS40aB7S9Ucbxw6v",
    color: "text-blue-600",
    bg: "bg-blue-600/10",
    hoverBg: "hover:bg-blue-600/20",
  },
  {
    name: "Instagram",
    icon: Instagram,
    followersNum: 20.4,
    followersSuffix: "k+",
    decimals: 1,
    page: "Travel with Moeen",
    url: "https://www.instagram.com/travelwithmoeen/",
    color: "text-pink-500",
    bg: "bg-pink-500/10",
    hoverBg: "hover:bg-pink-500/20",
  },
  {
    name: "TikTok",
    icon: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.69a8.18 8.18 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.12z" />
      </svg>
    ),
    followersNum: 155.4,
    followersSuffix: "K+",
    decimals: 1,
    page: "Travel with Moeen",
    url: "https://www.tiktok.com/@travelwithmoeen",
    color: "text-foreground",
    bg: "bg-foreground/5",
    hoverBg: "hover:bg-foreground/10",
  },
];

export function SocialMediaSection() {
  return (
    <section className="bg-muted/30 py-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <h2 className="mb-2 text-3xl font-bold text-secondary-foreground md:text-4xl">
            Connect With Us
          </h2>
          <p className="text-muted-foreground">
            Join our growing community of 300K+ travel enthusiasts.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {socials.map((s, i) => (
            <motion.a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className={`group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 shadow-card transition-shadow duration-300 hover:shadow-card-hover md:p-8`}
            >
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-full ${s.bg} ${s.hoverBg} ${s.color} transition-colors duration-300`}
              >
                <s.icon className="h-8 w-8" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {s.name}
              </span>
              <CounterStat
                end={s.followersNum}
                suffix={s.followersSuffix}
                decimals={s.decimals}
              />
              <span className="text-sm text-muted-foreground">{s.page}</span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
