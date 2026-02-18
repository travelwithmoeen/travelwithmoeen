"use client";

import Image from "next/image";
import { useState } from "react";

interface TourPackage {
  category: string;
  price: number;
  features: string[];
}

interface TourDay {
  day: number;
  title: string;
  description?: string;
  highlights: string[];
}

type Tour = {
  id: string;
  name: string;
  location: string;
  region: string;
  duration: number;
  description: string;
  image: string;
  galleryImages: string[];
  transport: string;
  basePrice: number;
  packages: TourPackage[];
  itinerary: TourDay[];
  included: string[];
  notIncluded: string[];
};

export default function TourTemplate({ tour }: { tour: Tour }) {
  const [selectedImage, setSelectedImage] = useState(tour.image);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white text-black">
      {/* ===== PRINT STYLES ===== */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>

      {/* ===== FLOATING DOWNLOAD BUTTON ===== */}
      <button
        onClick={handlePrint}
        className="fixed bottom-6 right-6 z-50 bg-[#1c395b] text-white px-6 py-3 rounded-full shadow-lg hover:bg-[#f5a81a] hover:text-[#1c395b] transition-all duration-300 flex items-center gap-2 print:hidden"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Save as PDF
      </button>

      <div>
      
      {/* ===== HEADER ===== */}
      <div className="bg-[#1c395b] text-white py-6 text-center shadow-lg">
        <h1 className="text-4xl font-bold tracking-wide">
          Travel with Moheen
        </h1>
        <p className="text-[#f5a81a] mt-2 text-sm">
          Explore the Beauty of Pakistan
        </p>
      </div>

      {/* ===== HERO SECTION ===== */}
      <div className="relative h-[450px] w-full">
        <Image
          src={selectedImage}
          alt={tour.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white text-center px-4">
          <h2 className="text-3xl md:text-5xl font-bold">{tour.name}</h2>
          <p className="mt-3 text-lg">
            {tour.location} • {tour.duration} Days • {tour.transport}
          </p>
          <p className="mt-2 text-[#f5a81a] font-semibold text-xl">
            Starting From PKR {tour.basePrice.toLocaleString()}
          </p>
        </div>
      </div>

      {/* ===== DESCRIPTION ===== */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h3 className="text-2xl font-bold text-[#1c395b] mb-4">
          Tour Overview
        </h3>
        <p className="text-gray-700 leading-relaxed">
          {tour.description}
        </p>
      </div>

      {/* ===== PACKAGES ===== */}
      <div className="bg-gray-100 py-10">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-2xl font-bold text-[#1c395b] mb-6">
            Package Options (For 2 Persons)
          </h3>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {tour.packages.map((pkg, index) => (
              <div
                key={index}
                className="bg-white shadow-lg rounded-xl p-5 border-t-4 border-[#f5a81a] hover:shadow-xl transition-shadow"
              >
                <h4 className="text-lg font-bold text-[#1c395b] mb-2">
                  {pkg.category}
                </h4>
                <p className="text-[#f5a81a] font-bold text-xl">
                  PKR {pkg.price.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mb-3">For 2 Persons</p>
                <ul className="space-y-2 text-xs text-gray-600">
                  {pkg.features.map((feature: string, i: number) => (
                    <li key={i} className="flex items-start">
                      <span className="text-green-500 mr-1">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== ITINERARY ===== */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h3 className="text-2xl font-bold text-[#1c395b] mb-6">
          Itinerary
        </h3>

        <div className="space-y-6">
          {tour.itinerary.map((day: TourDay) => (
            <div
              key={day.day}
              className="border-l-4 border-[#f5a81a] pl-6"
            >
              <h4 className="text-xl font-semibold text-[#1c395b]">
                Day {day.day}: {day.title}
              </h4>

              <ul className="mt-3 space-y-2 text-gray-700 text-sm">
                {day.highlights.map((item: string, i: number) => (
                  <li key={i}>• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ===== INCLUDED / NOT INCLUDED ===== */}
      <div className="bg-gray-100 py-10">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10">
          
          <div>
            <h3 className="text-xl font-bold text-[#1c395b] mb-4">
              Included
            </h3>
            <ul className="space-y-2 text-gray-700">
              {tour.included.map((item, i) => (
                <li key={i}>✔ {item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-[#1c395b] mb-4">
              Not Included
            </h3>
            <ul className="space-y-2 text-gray-700">
              {tour.notIncluded.map((item, i) => (
                <li key={i}>✘ {item}</li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* ===== GALLERY ===== */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h3 className="text-2xl font-bold text-[#1c395b] mb-6">
          Gallery
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tour.galleryImages.map((img, index) => (
            <div
              key={index}
              className="relative h-32 cursor-pointer rounded-lg overflow-hidden"
              onClick={() => setSelectedImage(img)}
            >
              <Image
                src={img}
                alt="gallery"
                fill
                className="object-cover hover:scale-110 transition duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ===== FOOTER ===== */}
   
      </div>
    </div>
  );
}
