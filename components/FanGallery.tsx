"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Image from 'next/image';

interface CardData {
  id: number;
  image: string;
  title: string;
  rotation: number;
}

const cards: CardData[] = [
  {
    id: 1,
    image: '/images/Picture7.jpg',
    title: 'Honeymoon',
    rotation: -15,
  },
  {
    id: 2,
    image: '/images/Picture8.jpg',
    title: 'Nature & Wildlife',
    rotation: -7,
  },
  {
    id: 3,
    image: '/images/Picture9.jpg',
    title: 'Adventure',
    rotation: 0,
  },
  {
    id: 4,
    image: '/images/Picture11.jpg',
    title: 'Hiking',
    rotation: 7,
  },
 
];  

const GalleryCard = ({
  card,
  index,
  scrollYProgress,
}: {
  card: CardData;
  index: number;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}) => {
  // Calculate grid position with gaps between cards (4 cards total)
  // Card width is ~288px (lg:w-72), adding 20px gap between cards
  const cardWidth = 300; // width + gap
  const gridOffsets = [
    -(cardWidth * 1.5), // Left 2nd position
    -(cardWidth * 0.5), // Left 1st position
    cardWidth * 0.5,    // Right 1st position
    cardWidth * 1.5,    // Right 2nd position
  ];
  const targetX = gridOffsets[index];

  // Scroll-based transforms - cards grow significantly larger
  const rotate = useTransform(scrollYProgress, [0.1, 0.5], [card.rotation, 0]);
  const x = useTransform(scrollYProgress, [0.1, 0.5], [0, targetX]);
  const scale = useTransform(scrollYProgress, [0.1, 0.5], [0.5, 1]); // Start smaller, grow bigger
  const zIndex = useTransform(scrollYProgress, [0.1, 0.5], [4 - Math.abs(index - 1.5), 1]);
  const labelOpacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);
  const labelY = useTransform(scrollYProgress, [0.4, 0.6], [20, 0]);

  // Add small offset when cards are stacked for visible gap
  const stackedOffset = (index - 1.5) * 15; // Small horizontal offset when stacked
  const xWithOffset = useTransform(scrollYProgress, [0.1, 0.5], [stackedOffset, targetX]);

  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        rotate,
        x: xWithOffset,
        scale,
        zIndex,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="w-56 md:w-64 lg:w-72">
        <div className="relative overflow-hidden rounded-2xl shadow-2xl border-4 border-white">
          <Image
            src={card.image}
            alt={card.title}
            width={400}
            height={500}
            className="w-full h-72 md:h-80 lg:h-96 object-cover"
          />
        </div>
        <motion.div
          className="flex items-center justify-between px-2 py-4"
          style={{ opacity: labelOpacity, y: labelY }}
        >
          <h3 className="text-lg md:text-xl font-semibold text-slate-900">
            {card.title}
          </h3>
          <div className="w-8 h-8 rounded-full border-2 border-blue-600 flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-colors">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const MobileCard = ({ card }: { card: CardData }) => {
  return (
    <motion.div
      className="w-full max-w-sm mx-auto"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative overflow-hidden rounded-2xl shadow-xl border-4 border-white">
        <Image
          src={card.image}
          alt={card.title}
          width={400}
          height={500}
          className="w-full h-80 object-cover"
        />
      </div>
      <div className="flex items-center justify-between px-2 py-4">
        <h3 className="text-xl font-semibold text-slate-900">
          {card.title}
        </h3>
        <div className="w-8 h-8 rounded-full border-2 border-blue-600 flex items-center justify-center text-blue-600">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
    </motion.div>
  );
};

export function FanGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  return (
    <div ref={containerRef} className="min-h-[250vh] bg-slate-50">
      {/* Header Section */}
      <div className="h-screen flex flex-col items-center justify-center px-6">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm uppercase tracking-[0.3em] text-slate-500 mb-4"
        >
          Travel Collection
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 text-center mb-6"
          style={{ fontFamily: 'var(--font-philosopher)' }}
        >
          Discover Your
          <br />
          <span className="text-blue-600">Next Adventure</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-slate-600 text-center max-w-md mb-8 text-lg"
        >
          Scroll down to explore our curated collection of breathtaking
          destinations
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="animate-bounce"
        >
          <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center">
            <motion.div
              className="w-1.5 h-3 bg-blue-600 rounded-full mt-2"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>

      {/* Desktop: Sticky Fan Animation */}
      <div className="hidden md:block sticky top-0 h-screen overflow-hidden">
        <div className="h-full flex items-center justify-center">
          <div className="relative flex items-center justify-center w-full max-w-7xl mx-auto">
            {cards.map((card, index) => (
              <GalleryCard
                key={card.id}
                card={card}
                index={index}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: Vertical Stack */}
      <div className="md:hidden px-6 py-12 space-y-12">
        {cards.map((card) => (
          <MobileCard key={card.id} card={card} />
        ))}
      </div>

      {/* Bottom Spacer */}
      <div className="h-[80vh]" />
    </div>
  );
}
