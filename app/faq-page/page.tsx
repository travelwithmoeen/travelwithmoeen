"use client";

import React from 'react'
import { motion, useInView } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
export default function page() {
  return (
    <div>

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


    </div>
  )
}
