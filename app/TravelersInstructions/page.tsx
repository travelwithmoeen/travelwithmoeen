"use client";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { IdCard, Luggage, Shirt, CloudRain, Droplets, Clock, Heart } from "lucide-react";

const instructions = [
  { icon: IdCard, title: "Documentation", text: "Carry your original CNIC. Married couples requiring separate rooms must carry a Nikahnama photocopy or updated CNIC." },
  { icon: Luggage, title: "Travel Light", text: "Aim for a luggage weight of 10 KG. Use a backpack for daily excursions to avoid hauling heavy suitcases everywhere." },
  { icon: Shirt, title: "Clothing (Gents)", text: "2-3 pairs of jeans, trousers, shirts/T-shirts, a jacket, and sturdy joggers." },
  { icon: Shirt, title: "Clothing (Ladies)", text: "3-4 suits, warm uppers/jackets, warm boots, and a shawl." },
  { icon: CloudRain, title: "Weather Prep", text: "Pack thermals for extreme cold and a raincoat or umbrella for unexpected showers." },
  { icon: Droplets, title: "Essentials", text: "Bring your own toiletries (toothpaste, face wash, etc.) and a reusable water bottle." },
  { icon: Clock, title: "Punctuality", text: "Please be on time. Delays may result in skipping certain sightseeing spots to maintain the schedule." },
  { icon: Heart, title: "Conduct", text: "Treat fellow travelers like family. Ensure everyone feels safe and connected, and always show utmost respect to the local communities we visit." },
];

export default function TravelersInstructions() {
  return (
    <div className="min-h-screen bg-">


      <section className="relative bg-navy py-20 text-center text-white">
        <div className=" bg-navy " />
        <motion.div
          className="container relative mx-auto px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="mb-3 inline-block rounded-full bg-gold/90 px-4 py-1.5 text-sm font-semibold text-white">
            Guide
          </span>
          <h1 className="text-3xl font-bold text-white md:text-5xl">
            Traveler's Instructions & Packing Guide
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            To ensure a smooth journey with Travel with Moeen, please follow these guidelines.
          </p>
        </motion.div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl grid gap-6 sm:grid-cols-2">
          {instructions.map((item, i) => (
            <motion.div
              key={item.title}
              className="rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#fef7e5]">
                <item.icon className="h-6 w-6 text-gold" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-navy">
                {i + 1}. {item.title}
              </h3>
              <p className="text-foreground/70 leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Acknowledgment */}
        <motion.div
          className="mx-auto mt-12 max-w-4xl rounded-xl border-2 border-gold/30 bg-[#fef7e5] p-6 text-center md:p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="mb-2 text-xl font-bold text-navy">Acknowledgment</h3>
          <p className="text-foreground/70">
            By booking a trip with Travel with Moeen, you acknowledge that you have read, understood, and agreed to the terms listed above.
          </p>
        </motion.div>
      </section>


    </div>
  );
}
