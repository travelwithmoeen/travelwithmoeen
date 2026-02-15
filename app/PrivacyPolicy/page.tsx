"use client";

import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { FileText, Bus, Hotel, Shield, Heart, AlertTriangle } from "lucide-react";

const sections = [
  {
    icon: AlertTriangle,
    title: "1. Trip Cancellations & Changes",
    items: [
      { label: "Minimum Capacity", text: "Our group tours require a minimum of 10–12 participants. If a trip is cancelled by Travel with Moeen due to low registration, members are entitled to a 100% refund or a credit transfer to a future trip." },
      { label: "Company Rights", text: "Travel with Moeen reserves the right to cancel a booking or amend these Terms & Conditions at any time without prior notice." },
    ],
  },
  {
    icon: Bus,
    title: "2. Logistics & Punctuality",
    items: [
      { label: "Reporting Time", text: "Members must report to the departure point 1 hour before the scheduled time." },
      { label: "Late Arrivals", text: "To respect everyone's schedule, the tour bus will depart exactly 15 minutes after the scheduled time. We take no responsibility for missed departures, and no refunds or extra expenses will be covered in such cases." },
      { label: "Tickets & Fare", text: "Bus, Air, or Train tickets are subject to availability. Prices are based on current fuel rates; any significant hike in fuel prices before or during the trip may result in a package price adjustment." },
    ],
  },
  {
    icon: Hotel,
    title: "3. Accommodation & Rooming",
    items: [
      { label: "Standard Sharing", text: "Rooms are provided on a (3-person) sharing basis, which includes mattresses." },
      { label: "2-Person Sharing", text: "Limited to married couples, family members, or two individuals of the same gender (2 Males / 2 Females)." },
      { label: "Availability", text: "Mentioned hotels are subject to availability, especially during peak seasons. If a specific hotel is unavailable, an equivalent standard will be provided." },
    ],
  },
  {
    icon: Shield,
    title: "4. Code of Conduct & Ethics",
    items: [
      { label: "Behavior", text: "We maintain a high standard of ethical integrity. Members must behave respectfully toward fellow travelers and the team leader." },
      { label: "Strict Prohibitions", text: "Personal weapons and drugs are strictly prohibited." },
      { label: "Consequences", text: "Failure to follow the Team Leader's instructions or any breach of ethical conduct may result in immediate cancellation of your trip without a refund." },
    ],
  },
  {
    icon: Heart,
    title: "5. Safety & Liability",
    items: [
      { label: "Personal Responsibility", text: "Travel with Moeen is not responsible for personal injuries, accidents, or the loss/theft of valuable items." },
      { label: "Environmental Care", text: "We have a zero-tolerance policy for littering. Please do not pollute the environment; violators may be fined." },
    ],
  },
  {
    icon: FileText,
    title: "6. Refund & Force Majeure Policy",
    items: [
      { label: "Exits During Trip", text: "No refunds will be issued if a member chooses to leave or exit the tour for any reason once the journey has begun." },
      { label: "Unforeseen Circumstances", text: 'No refunds shall be made in the event of natural disasters or "Acts of God" (e.g., heavy rain, landslides, road closures) or mechanical issues (e.g., engine failure, flat tires).' },
      { label: "Exclusions", text: "Entrance tickets for forts, museums, or national parks are not included in the package unless explicitly stated." },
    ],
  },
];

export default function page() {
  return (
    <div className="min-h-screen bg-background">
  

      <section className="relative bg-navy py-20 text-center text-white">
        <div className=" bg-navy" />
        <motion.div
          className="container relative mx-auto px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="mb-3 inline-block rounded-full bg-gold/90 px-4 py-1.5 text-sm font-semibold text-white">
            Legal
          </span>
          <h1 className="text-3xl font-bold text-white md:text-5xl">
            Privacy Policy
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            Travel with Moeen — How we handle and protect your information.
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
            </motion.div>
          ))}
        </div>
      </section>


    </div>
  );
}
