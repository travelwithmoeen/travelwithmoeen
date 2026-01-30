"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Globe, Eye, Target, MapPin, Phone, Mail, Clock,
  Building, Hotel, Users, Compass, HeadphonesIcon, Award,
  Facebook, Twitter, Instagram, ClipboardList, Calculator, CheckCircle, Binoculars
} from "lucide-react";

import Navbar from "@/components/Navbar";
import {Footer} from "@/components/Footer";
import PageBanner from "@/components/PageBanner";
import { Button } from "@/components/ui/button";
import aboutTravelers from "@/public/images/about-travelers.jpg";
import aboutThumb1 from "@/public/images/about-thumb1.jpg";
import aboutThumb2 from "@/public/images/about-thumb2.jpg";
import aboutWhyChoose from "@/public/images/about-why-choose.jpg";
import teamGuide1 from "@/public/images/team-guide1.jpg";
import teamGuide2 from "@/public/images/team-guide2.jpg";
import teamGuide3 from "@/public/images/team-guide3.jpg";

const processSteps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Book A Tour",
    description: "Lorem ipsum dolor sit amet, consecte adipiscing elit, sed do eiusmod dolore magna",
  },
  {
    number: "02",
    icon: Calculator,
    title: "Payment Process",
    description: "Lorem ipsum dolor sit amet, consecte adipiscing elit, sed do eiusmod dolore magna",
  },
  {
    number: "03",
    icon: CheckCircle,
    title: "Confirmation",
    description: "Lorem ipsum dolor sit amet, consecte adipiscing elit, sed do eiusmod dolore magna",
  },
  {
    number: "04",
    icon: Binoculars,
    title: "Enjoy Your Trip",
    description: "Lorem ipsum dolor sit amet, consecte adipiscing elit, sed do eiusmod dolore magna",
  },
];

const whyChooseFeatures = [
  { icon: Hotel, title: "Best Accommodation", description: "Premium hotels and resorts for your comfort" },
  { icon: MapPin, title: "Beautiful Destinations", description: "Hunza, Skardu, Kashmir, Fairy Meadows & more" },
  { icon: Award, title: "Competitive Price", description: "Best value luxury tours without compromise" },
  { icon: Building, title: "Luxury Transport", description: "Modern vehicles for safe, comfortable travel" },
  { icon: HeadphonesIcon, title: "Support 24/7", description: "Round-the-clock assistance for peace of mind" },
  { icon: Users, title: "Expert Guides", description: "Local experts bringing destinations to life" },
];

const teamMembers = [
  { name: "Ahmed Khan", role: "Tour Manager", image: teamGuide1 },
  { name: "Sara Ahmed", role: "Operations Manager", image: teamGuide2 },
  { name: "Hassan Ali", role: "Lead Guide", image: teamGuide3 },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* <Navbar /> */}
      <PageBanner
        title="About Us"
        subtitle="Quality Tourism Promoter Since 2020"
        backgroundImage={'images/contact-hero.jpg'}
      />

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
                  src={aboutTravelers}
                  alt="Travelers exploring"
                  className="w-full max-w-md rounded-2xl shadow-travel-strong"
                  placeholder="blur"
                />
                {/* Overlapping thumbnails */}
                <div className="absolute -bottom-8 right-0 lg:right-[-40px] flex gap-3">
                  <Image
                    src={aboutThumb1}
                    alt="Mountain destination"
                    className="w-28 h-28 object-cover rounded-xl shadow-lg border-4 border-background"
                    width={112}
                    height={112}
                    placeholder="blur"
                  />
                  <Image
                    src={aboutThumb2}
                    alt="Adventure destination"
                    className="w-28 h-28 object-cover rounded-xl shadow-lg border-4 border-background"
                    width={112}
                    height={112}
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
              <p className="text-gold font-serif italic text-lg mb-2">About Us</p>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                We Will Help You Find Your Dream Vacation
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Registered in Pakistan, Travel with Moeen specializes in deluxe and personalized 
                luxury experiences since 2020. We curate hassle-free travel in Pakistan's Northern 
                Areas with modern luxury transportation and premium accommodations.
              </p>

              {/* Vision & Mission */}
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-xl bg-yellow-400 flex items-center justify-center flex-shrink-0">
                    <Eye className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-primary mb-1">Our Vision</h3>
                    <p className="text-muted-foreground text-sm">
                      To become the leading luxury tour company in Pakistan for group, family, 
                      couple, and corporate tours.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-xl bg-[#0b1c2c] flex items-center justify-center flex-shrink-0">
                    <Target className="w-7 h-7 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-primary mb-1">Our Mission</h3>
                    <p className="text-muted-foreground text-sm">
                      To provide the finest luxury tours in Pakistan, making comfort the priority 
                      while delivering high-quality hospitality services.
                    </p>
                  </div>
                </div>
              </div>

              <Button asChild className="mt-8 bg-yellow-400 hover:bg-yellow-600 text-black font-semibold px-8">
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
            <p className="text-gold font-serif italic text-lg mb-2">Our Process</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
              We Complete Every Step Carefully
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua
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
                    index % 2 === 0 ? 'lg:mt-0' : 'lg:mt-24'
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

                  <h3 className="text-xl font-serif font-bold text-primary mt-6 mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm max-w-[200px] mx-auto">{step.description}</p>

                  {/* Curved Arrow to next step */}
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 -right-8 w-16 z-20">
                      {index % 2 === 0 ? (
                        /* Arrow going down-right */
                        <svg viewBox="0 0 60 50" className="w-16 h-12 text-muted-foreground/40">
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
                        <svg viewBox="0 0 60 50" className="w-16 h-12 text-muted-foreground/40">
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

      {/* Section 3: Why Choose Us (Dark Background) */}
      <section className="relative">
        <div className="grid lg:grid-cols-2 min-h-[600px]">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative h-[400px] lg:h-auto min-h-[400px]"
          >
            <Image
              src={aboutWhyChoose}
              alt="Happy travelers"
              className="object-cover"
              fill
              placeholder="blur"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </motion.div>

          {/* Right: Content with Navy Background */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-[#0B1C2D] p-8 lg:p-12 xl:p-16 flex flex-col justify-center"
          >
            <p className="text-yellow-500 font-serif italic text-lg mb-2">Why Choose Us</p>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-bold text-primary-foreground mb-4">
              We are Professional Planners for Your Vacations
            </h2>
            <p className="text-primary-foreground/70 mb-8 leading-relaxed">
              From the peaks of Hunza to the valleys of Skardu, we&apos;ve helped thousands
              of travelers experience Pakistan&apos;s beauty with luxury and comfort.
            </p>

            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
              {whyChooseFeatures.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#e8ac46] flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary-foreground mb-1">{feature.title}</h4>
                    <p className="text-primary-foreground/60 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

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
              Meet Our Professional Guides
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our experienced team brings destinations to life with authentic local knowledge 
              and warm hospitality.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="relative overflow-hidden rounded-t-2xl h-80">
                  <Image
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    fill
                    placeholder="blur"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-[#e8ac46]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex gap-3">
                      <a href="#" className="w-10 h-10 rounded-full bg-gold flex items-center justify-center hover:bg-gold-hover transition-colors">
                        <Facebook className="w-5 h-5 text-primary" />
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-gold flex items-center justify-center hover:bg-gold-hover transition-colors">
                        <Twitter className="w-5 h-5 text-primary" />
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-gold flex items-center justify-center hover:bg-gold-hover transition-colors">
                        <Instagram className="w-5 h-5 text-primary" />
                      </a>
                    </div>
                  </div>
                </div>
                {/* Name Card */}
                <div className="bg-card rounded-b-2xl p-6 text-center shadow-travel border border-border">
                  <h3 className="text-xl font-serif font-bold text-primary">{member.name}</h3>
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
            <p className="text-gold font-serif italic text-lg mb-2">Company Information</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary">
              Travel With Moeen
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-card p-6 rounded-2xl shadow-travel border border-border text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-primary mb-2">Address</h4>
              <p className="text-muted-foreground text-sm">
                Office # 3, 2nd Floor, Shalimar Plaza, F-10 Markaz, Islamabad
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-card p-6 rounded-2xl shadow-travel border border-border text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-primary mb-2">Phone</h4>
              <p className="text-muted-foreground text-sm">+92 333 9981177</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-card p-6 rounded-2xl shadow-travel border border-border text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-primary mb-2">Email</h4>
              <p className="text-muted-foreground text-sm">info@travelwithmoeen.com</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-card p-6 rounded-2xl shadow-travel border border-border text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-gold flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-semibold text-primary mb-2">Website</h4>
              <p className="text-muted-foreground text-sm">travelwithmoeen.com</p>
            </motion.div>
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
              {[
                { number: "5+", label: "Years Experience" },
                { number: "15+", label: "Destinations" },
                { number: "3000+", label: "Happy Clients" },
                { number: "100%", label: "Satisfaction" },
              ].map((stat, index) => (
                <div key={index}>
                  <p className="text-3xl md:text-4xl font-serif font-bold text-yellow-500">{stat.number}</p>
                  <p className="text-primary-foreground/80 mt-2">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="text-center border-t border-primary-foreground/20 pt-6">
              <p className="text-primary-foreground/60 text-sm">
                <span className="text-yellow-500 font-semibold">License:</span> Membership # 054, LIC ISB-9383
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* <Footer /> */}
    </div>
  );
};

export default About;
