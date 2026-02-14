"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Globe,
  Eye,
  Target,
  MapPin,
  Phone,
  Mail,
  Clock,
  Building,
  Hotel,
  Users,
  Compass,
  HeadphonesIcon,
  Award,
  Facebook,
  Twitter,
  Instagram,
  ClipboardList,
  Calculator,
  CheckCircle,
  Binoculars,
  ArrowRight,
  ChevronRight,
  ClipboardCheck,
  BadgeDollarSign,
  Headphones,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import aboutTravelers from "@/public/images/about-travelers.jpg";
import aboutThumb1 from "@/public/images/about-thumb1.jpg";
import aboutThumb2 from "@/public/images/about-thumb2.jpg";
import aboutWhyChoose from "@/public/images/about-why-choose.jpg";
import teamGuide1 from "@/public/images/team/Abdul_Majid_Operation_Manager.webp";
import teamGuide2 from "@/public/images/team/Faheem_Baloch_Media_Coordinator.webp";
import teamGuide3 from "@/public/images/team/Rizwan_Ahmad_Video_Editor.webp";
import teamGuide4 from "@/public/images/team/Sawaira_Fatima_Admin_Log_officer.webp";
import teamGuide5 from "@/public/images/team/TALIB_HUSSAIN_ARAPA_Tour_Manager.webp";
import teamGuide6 from "@/public/images/team/Rizwan_Ahmad_Finance_Manager.webp";
import Logo from "@/public/images/twm-logo.webp"
import Profile from "@/public/images/moeen/profile.jpg";
import RoundImage from "@/public/images/Picture14.jpg";
import vision1 from "@/public/images/moeen/vision1.jpg";
import vision2 from "@/public/images/moeen/vision2.jpg";
import vision3 from "@/public/images/moeen/vision3.jpg";
import { SocialMediaSection } from "@/components/home/SocialMediaSection";

// Counter component for animated stats
const CounterStat = ({
  end,
  suffix = "",
  label,
}: {
  end: number;
  suffix?: string;
  label: string;
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
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, end]);

  return (
    <div ref={ref}>
      <p className="text-3xl md:text-4xl font-serif font-bold text-yellow-500">
        {count}
        {suffix}
      </p>
      <p className="text-primary-foreground/80 mt-2">{label}</p>
    </div>
  );
};

const processSteps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Book A Tour Consult & Select",
    description:
      "Choose from our hand-picked public group tours or collaborate with our team to create a customized private itinerary that fits your schedule.",
  },
  {
    number: "02",
    icon: Calculator,
    title: "Payment Process Secure Booking",
    description:
      "Finalize your reservation through our transparent payment system. As a fully registered company, we ensure your transaction is handled professionally.",
  },
  {
    number: "03",
    icon: CheckCircle,
    title: "Confirmation Finalize Details",
    description:
      "Receive a comprehensive trip briefing and official confirmation. Our team double-checks every logistical detail to ensure your safety and comfort.",
  },
  {
    number: "04",
    icon: Binoculars,
    title: "Enjoy Your Trip Travel with Confidence",
    description:
      "Embark on your journey knowing you are supported by a seasoned team dedicated to providing authentic and high-quality tourism.",
  },
];

const whyChooseFeatures = [
  {
    icon: Hotel,
    title: "Best Accommodation",
    description: "Premium hotels and resorts for your comfort",
  },
  {
    icon: MapPin,
    title: "Beautiful Destinations",
    description: "Hunza, Skardu, Kashmir, Fairy Meadows & more",
  },
  {
    icon: Award,
    title: "Competitive Price",
    description: "Best value luxury tours without compromise",
  },
  {
    icon: Building,
    title: "Luxury Transport",
    description: "Modern vehicles for safe, comfortable travel",
  },
  {
    icon: HeadphonesIcon,
    title: "Support 24/7",
    description: "Round-the-clock assistance for peace of mind",
  },
  {
    icon: Users,
    title: "Expert Guides",
    description: "Local experts bringing destinations to life",
  },
];

const teamMembers = [
  { name: "Abdul Majid ", role: "Operation Manager", image: teamGuide1 },
  { name: "Faheem Baloch ", role: "Media Coordinator", image: teamGuide2 },
  { name: "Rizwan Ahmad", role: "Video Editor", image: teamGuide3 },
  { name: "Sawaira Fatima", role: "Admin & Log Officer", image: teamGuide4 },
  { name: "Talib Hussain", role: "Tour Manager", image: teamGuide5 },
  { name: "Muhammad Umair", role: "Finance Manager", image: teamGuide6 },
];

const faqItems = [
  {
    question: "What destinations does Travel with Moeen cover?",
    answer:
      "We specialize in redefining quality tourism within Pakistan and abroad. Our services include carefully planned adventures to domestic northern regions and travel logistics for international destinations.",
  },
  {
    question: "What is included in your tour packages? ",
    answer:
      "Our packages are carefully organized to ensure safety, comfort, and a premium experience. Typically, this includes professional logistical management, authentic travel insights, and expert-led itineraries for individuals, families, and corporate groups.",
  },
  {
    question: "How do I book a tour with Travel with Moeen? ",
    answer:
      "You can start by selecting a tour or requesting a customized itinerary. As a fully registered travel management company, we invite you to contact our team or visit our Islamabad headquarters to discuss your travel plans.",
  },
  {
    question: "What is your cancellation and refund policy? ",
    answer:
      "We maintain professional excellence in all our business dealings. Cancellation and refund terms are clearly defined based on the specific tour type—public, private, or corporate—and will be provided transparently during your booking process.",
  },
  {
    question: "Do you offer customized or private tours?",
    answer:
      "Yes, we specialize in both public group adventures and exclusive private tours. We also provide tailor-made itineraries designed to meet your specific interests and schedule.",
  },
  {
    question: "Is it safe to travel to northern areas of Pakistan?",
    answer:
      "Safety is our top priority. Our founder’s background in high-stakes international organizations, including the UN and USAID, ensures that we apply strict international standards to every trip we manage.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* <Navbar /> */}
      <PageBanner
        title="About Us"
        subtitle="Quality Tourism Promoter Since 2020"
        backgroundImage={"images/contact-hero.jpg"}
      />

      {/* Section: Expertly Crafted Travel Experiences */}
      <section className="py-20 px-4 bg-[#f7f6f2]">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Overlapping Images */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-[500px]"
            >
              {/* Background rectangular image */}
              <div className="absolute top-0 left-0 w-[70%] h-[80%] rounded-3xl overflow-hidden shadow-xl z-10">
                <Image
                  src={Profile}
                  alt="Temple destination"
                  fill
                  className="object-cover"
                  placeholder="blur"
                />
              </div>

              {/* Overlapping circular image */}
              {/* <div className="absolute bottom-8 right-0 lg:bottom-0 lg:right-[-40px] w-48 h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden   z-20">
                <div className="relative w-full h-full">
                  <Image
                    src={Logo}
                    alt="Travel with Moeen Logo"
                    fill
                    className="object-contain"
                    placeholder="blur"
                  />
                </div>
              </div> */}
            </motion.div>

            {/* Right: Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif">
                <span className="font-bold">About Us </span> Travel with Moeen
              </h2>

              <p className="text-muted-foreground leading-relaxed">
                Welcome to Travel with Moeen, a premier travel management
                company dedicated to redefining quality tourism in Pakistan and
                abroad. Founded on the principles of authenticity and
                professional excellence, we provide meticulously curated travel
                experiences for individuals, families, and corporate entities.
              </p>

              {/* Features */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                    <ClipboardCheck className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">
                      Expert Travel Advisors
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      Our experienced team ensures your trip is stress-free,
                      safe, and well-planned.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                    <BadgeDollarSign className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">
                      Affordable & Transparent Pricing
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      No hidden costs—just great value for your perfect
                      vacation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                    <Headphones className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">
                      24/7 Customer Support
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      Enjoy peace of mind with our round-the-clock assistance
                      wherever you travel.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 1: About Intro with Creative Image Layout */}
      <section className="py-20 px-4">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Creative Image Layout */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="relative">
                <Image
                  src={vision3}
                  alt="Travelers exploring"
                  className="w-full max-w-md rounded-2xl shadow-travel-strong"
                  placeholder="blur"
                />
                {/* Overlapping thumbnails */}
                <div className="absolute -bottom-8 right-0 lg:right-[-40px] flex gap-3">
                  <Image
                    src={vision2}
                    alt="Mountain destination"
                    className="w-28 h-28 object-cover rounded-xl shadow-lg border-4 border-background"
                    width={112}
                    height={112}
                    placeholder="blur"
                  />
                  <Image
                    src={vision1}
                    alt="Adventure destination"
                    className="w-28 h-28 object-cover rounded-xl shadow-lg border-4 border-background"
                    width={116}
                    height={116}
                    placeholder="blur"
                  />
                </div>
              </div>
            </motion.div>

            {/* Right: Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* <p className="text-gold font-serif italic text-lg mb-2">
                About Us
              </p> */}
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                The Visionary Behind the Brand
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Moeen Akhtar, the founder of Travel with Moeen, brings a unique
                blend of corporate discipline and a passion for exploration.
                Originally from Dera Ismail Khan, Moeen relocated to Islamabad
                in 2009 after earning his MBA. Before transitioning into
                entrepreneurship in 2016, he spent years serving in high-stakes
                environments for prestigious international organizations,
                including INGOs, USAID, and the United Nations. This background
                in international standards and logistical precision is the
                backbone of the "Quality Tourism" we deliver today.
              </p>

              {/* Vision & Mission */}
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-xl bg-yellow-400 flex items-center justify-center flex-shrink-0">
                    <Eye className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-primary mb-1">
                      Our Vision
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      To become the leading luxury tour company in Pakistan for
                      group, family, couple, and corporate tours.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-xl bg-[#0b1c2c] flex items-center justify-center flex-shrink-0">
                    <Target className="w-7 h-7 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-primary mb-1">
                      Our Mission
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      To provide the finest luxury tours in Pakistan, making
                      comfort the priority while delivering high-quality
                      hospitality services.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                asChild
                className="mt-8 bg-yellow-400 hover:bg-yellow-600 text-black font-semibold px-8"
              >
                <Link href="/gallery">View Tours</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 2: Our Process */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <p className="text-gold font-serif italic text-lg mb-2">
              Our Process
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
              We Complete Every Step Carefully
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From your first inquiry to your final destination, we apply corporate standards and logistical precision to ensure a seamless travel experience.
            </p>
          </motion.div>

          {/* Zigzag Process Steps */}
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-4">
              {processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative text-center ${
                    index % 2 === 0 ? "lg:mt-0" : "lg:mt-24"
                  }`}
                >
                  {/* Icon Box with Number Badge */}
                  <div className="relative inline-block">
                    {/* Step Number Badge */}
                    <div className="absolute -top-2 -left-2 z-10">
                      <span className="bg-[#1d3556] text-white text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-md">
                        {step.number}
                      </span>
                    </div>

                    {/* Icon Box */}
                    <div className="w-24 h-28 bg-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <step.icon className="w-12 h-12 text-white" />
                    </div>
                  </div>

                  <h3 className="text-xl font-serif font-bold text-primary mt-6 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-[200px] mx-auto">
                    {step.description}
                  </p>

                  {/* Curved Arrow to next step */}
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 -right-8 w-16 z-20">
                      {index % 2 === 0 ? (
                        /* Arrow going down-right */
                        <svg
                          viewBox="0 0 60 50"
                          className="w-16 h-12 text-muted-foreground/40"
                        >
                          <path
                            d="M5 5 Q30 5, 40 25 Q50 45, 55 45"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray="4 3"
                            fill="none"
                          />
                          <path
                            d="M50 40 L56 46 L50 50"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                          />
                        </svg>
                      ) : (
                        /* Arrow going up-right */
                        <svg
                          viewBox="0 0 60 50"
                          className="w-16 h-12 text-muted-foreground/40"
                        >
                          <path
                            d="M5 45 Q30 45, 40 25 Q50 5, 55 5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray="4 3"
                            fill="none"
                          />
                          <path
                            d="M50 0 L56 5 L50 10"
                            stroke="currentColor"
                            strokeWidth="2"
                            fill="none"
                          />
                        </svg>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section: Why Choose + Gateway to Journeys */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-3 gap-8 items-center">
            {/* Left Column: Why Choose Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-serif">
                <span className="italic">Why Choose Travel with Moeen</span> to
                Make Your Journey <span className="italic">Truly</span>{" "}
                Meaningful?
              </h2>
              <p className="text-muted-foreground">
             Redefining quality tourism through expert guidance, transparent pricing, and unforgettable global destinations.
              </p>

              {/* Feature List */}
              <ul className="space-y-3">
                {[
                  "Top Destinations",
                  "Flexible Travel Packages",
                  "Expert Travel Guides",
                  "Affordable & Transparent Pricing",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Box */}
              <div className="bg-[#1a1a1a] rounded-3xl p-6 mt-8">
                <h3 className="text-white text-2xl font-serif mb-2">
                  <span className="font-bold">Ready to</span> explore
                  <br />
                  the <span className="font-bold">world?</span>
                </h3>
                <Link
                  href="/tours"
                  className="inline-flex items-center gap-2 text-white font-semibold mt-4 hover:gap-3 transition-all"
                >
                  Discover Now
                  <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                    <ChevronRight className="w-4 h-4 text-black" />
                  </span>
                </Link>
              </div>
            </motion.div>

            {/* Center Column: Circular Image with Badge */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative flex justify-center"
            >
              {/* Years Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:-top-2 lg:right-4 z-10">
                <div className="w-24 h-24 rounded-full bg-[#1a1a1a] flex flex-col items-center justify-center text-white">
                  <span className="text-2xl font-bold">5+</span>
                  <span className="text-xs text-center leading-tight">
                    Years
                    <br />
                    Experienced
                  </span>
                </div>
              </div>

              {/* Main Circular Image */}
              <div className="relative w-72 h-96 lg:w-80 lg:h-[450px]">
                <div
                  className="absolute inset-0 rounded-full overflow-hidden"
                  style={{ borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%" }}
                >
                  <Image
                    src={Profile}
                    alt="Traveler exploring"
                    fill
                    className="object-cover"
                    placeholder="blur"
                  />
                </div>
              </div>
            </motion.div>

            {/* Right Column: Gateway to Journeys */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              {/* Rounded Image */}
              <div className="relative h-48 w-full rounded-[40px] overflow-hidden">
                <Image
                  src={RoundImage}
                  alt="Destination"
                  fill
                  className="object-cover"
                  placeholder="blur"
                />
              </div>

              <h2 className="text-3xl md:text-4xl font-serif">
                <span className="italic">Gateway</span> to
                <br />
                <span className="italic">Unforgettable</span>
                <br />
                Journeys.
              </h2>

              <p className="text-muted-foreground leading-relaxed">
                Travel with Moeen is a trusted travel agency that brings the
                best travel experiences to exotic destinations around the world.
                We offer exclusive tour packages, private tours, and
                unforgettable adventures designed to meet the needs of every
                traveler.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 3: Why Choose Us (Dark Background) */}
   

      {/* Section 4: Our Team */}
      <section className="py-20 px-4">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <p className="text-gold font-serif italic text-lg mb-2">Our Team</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
              Meet Our Professional Teams
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our experienced team brings destinations to life with authentic
              local knowledge and warm hospitality.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="relative overflow-hidden rounded-t-2xl h-96">
                  <Image
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    fill
                    placeholder="blur"
                  />
                  {/* Hover Overlay */}
                  {/* <div className="absolute inset-0 bg-[#e8ac46]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex gap-3">
                      <a
                        href="#"
                        className="w-10 h-10 rounded-full bg-gold flex items-center justify-center hover:bg-gold-hover transition-colors"
                      >
                        <Facebook className="w-5 h-5 text-primary" />
                      </a>
                      <a
                        href="#"
                        className="w-10 h-10 rounded-full bg-gold flex items-center justify-center hover:bg-gold-hover transition-colors"
                      >
                        <Twitter className="w-5 h-5 text-primary" />
                      </a>
                      <a
                        href="#"
                        className="w-10 h-10 rounded-full bg-gold flex items-center justify-center hover:bg-gold-hover transition-colors"
                      >
                        <Instagram className="w-5 h-5 text-primary" />
                      </a>
                    </div>
                  </div> */}
                </div>
                {/* Name Card */}
                <div className="bg-card rounded-b-2xl p-6 text-center shadow-travel border border-border">
                  <h3 className="text-xl font-serif font-bold text-primary">
                    {member.name}
                  </h3>
                  <p className="text-muted-foreground">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Company Info */}
      <section className="py-16 px-4 bg-[#f7f6f2]">
        <div className="max-w-[1200px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="text-gold font-serif italic text-lg mb-2">
              Company Information
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary">
              Travel With Moeen
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <motion.a
              href="https://www.google.com/maps/search/?api=1&query=Office+3+2nd+Floor+Shalimar+Plaza+F-10+Markaz+Islamabad"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-card p-6 rounded-2xl shadow-travel border border-border text-center cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-primary mb-2">Address</h4>
              <p className="text-muted-foreground text-sm">
                Office # 3, 2nd Floor, Shalimar Plaza, F-10 Markaz, Islamabad
              </p>
            </motion.a>

            <motion.a
              href="tel:+923339981177"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-card p-6 rounded-2xl shadow-travel border border-border text-center cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-primary mb-2">Phone</h4>
              <p className="text-muted-foreground text-sm">+92 333 9981177</p>
            </motion.a>

            <motion.a
              href="mailto:info@travelwithmoeen.com"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-card p-6 rounded-2xl shadow-travel border border-border text-center cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-primary mb-2">Email</h4>
              <p className="text-muted-foreground text-sm">
                info@travelwithmoeen.com
              </p>
            </motion.a>

            <motion.a
              href="https://travelwithmoeen.com"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-card p-6 rounded-2xl shadow-travel border border-border text-center cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-primary mb-2">Website</h4>
              <p className="text-muted-foreground text-sm">
                travelwithmoeen.com
              </p>
            </motion.a>
          </div>

          {/* Stats & Credentials */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#162a48] from-navy to-navy-dark rounded-2xl p-8 md:p-12"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-8">
              <CounterStat end={50} suffix="+" label="Tours" />
              <CounterStat end={10} suffix="+" label="Countries" />
              <CounterStat end={40} suffix="k+" label="Happy Clients" />
              <CounterStat end={20} suffix="+" label="Activities" />
            </div>
            <div className="text-center border-t border-primary-foreground/20 pt-6">
              <p className="text-primary-foreground/60 text-sm">
                <span className="text-yellow-500 font-semibold">License:</span>{" "}
                Membership # 054, LIC ISB-9383
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-[900px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <p className="text-gold font-serif italic text-lg mb-2">
              Have Questions?
            </p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about our tours, booking process,
              and travel experiences.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqItems.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card border border-border rounded-xl px-6 shadow-sm"
                >
                  <AccordionTrigger className="text-left font-semibold text-primary hover:no-underline py-5">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>
              <SocialMediaSection/>
      {/* <Footer /> */}
    </div>
  );
};

export default About;
