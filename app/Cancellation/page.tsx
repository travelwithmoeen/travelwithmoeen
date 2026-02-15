"use client";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { CreditCard, Hotel, Car, Users, PackageX } from "lucide-react";

const sections = [
  {
    icon: CreditCard,
    title: "A. Service Charges (Private Tours)",
    desc: "In the event of any cancellation, the following Travel with Moeen service charges apply (in addition to hotel/transport penalties):",
    items: [
      { label: "Cash Refund", text: "10% of the total package price is deducted." },
      { label: "Credit Adjustment", text: "5% deduction if the balance is adjusted toward a new booking within the next 3 months. (Note: New package prices may vary based on peak/off-season rates)." },
    ],
  },
  {
    icon: Hotel,
    title: "B. Hotel Cancellations",
    items: [
      { label: "Over 2 weeks' notice", text: "100% Refund." },
      { label: "1 week notice", text: "75% Refund." },
      { label: "7 days to 24 hours' notice", text: "60% Refund." },
      { label: "Within 24 hours (due to flight/road issues)", text: "60% refund or adjustment within the same calendar year." },
    ],
    note: "Some hotels have stricter policies. Please confirm with your agent if your specific hotel allows refunds or only date adjustments.",
  },
  {
    icon: Car,
    title: "C. Transport Cancellations",
    items: [
      { label: "Over 1 week notice", text: "100% Refund." },
      { label: "7 days to 24 hours' notice", text: "Deduction of 1-day car rental." },
      { label: "Within 24 hours", text: "Deduction of a minimum of 2-days car rental." },
    ],
  },
  {
    icon: Users,
    title: "D. Group / Fixed Departure Tours",
    items: [
      { label: "15+ days before trip", text: "90% Refund." },
      { label: "7–14 days before trip", text: "50% Refund." },
      { label: "5 days before trip", text: "25% Refund." },
      { label: "Less than 5 days", text: "0% Refund." },
      { label: "Unused Services", text: "No refunds are provided for non-utilization of any service (jeep rides, day visits, etc.) once the trip is underway." },
    ],
  },
];

export default function Cancellation() {
  return (
    <div className="min-h-screen bg-background">


      <section className="relative bg-navy py-20 text-center text-secondary-foreground">
        <div className=" bg-navy" />
        <motion.div
          className="container relative mx-auto px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="mb-3 inline-block rounded-full bg-gold/90 px-4 py-1.5 text-sm font-semibold text-white">
            Policy
          </span>
          <h1 className="text-3xl font-bold text-white md:text-5xl">
            Refund & Cancellation Policy
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            Travel with Moeen — Understand our refund structure before you book.
          </p>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl space-y-10">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              className="rounded-xl border border-border bg-card p-6 shadow-card md:p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
                  <section.icon className="h-5 w-5 text-gold" />
                </div>
                <h2 className="text-xl font-bold text-navy md:text-2xl">{section.title}</h2>
              </div>
              {section.desc && (
                <p className="mb-4 text-foreground/70">{section.desc}</p>
              )}
              <ul className="space-y-4">
                {section.items.map((item) => (
                  <li key={item.label} className="flex gap-3">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    <p className="text-foreground/80">
                      <strong className="text-foreground">{item.label}:</strong> {item.text}
                    </p>
                  </li>
                ))}
              </ul>
              {section.note && (
                <div className="mt-4 rounded-lg bg-primary/5 border border-primary/20 p-4">
                  <p className="text-sm text-foreground/70">
                    <strong className="text-primary">Note:</strong> {section.note}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

 
    </div>
  );
}
