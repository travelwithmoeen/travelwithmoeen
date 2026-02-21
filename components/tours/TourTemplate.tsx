"use client";

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
  const [isDownloading, setIsDownloading] = useState(false);

  // Get Deluxe price from packages (first package is Deluxe)
  const deluxePackage = tour.packages.find(pkg => pkg.category === "Deluxe");
  const displayPrice = deluxePackage?.price || tour.basePrice;

  const handleDownloadPDF = async () => {
    setIsDownloading(true);

    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;
      let y = 0;

      // Helper function to add new page if needed
      const checkNewPage = (height: number) => {
        if (y + height > 280) {
          doc.addPage();
          y = 15;
        }
      };

      // Header
      doc.setFillColor(28, 57, 91);
      doc.rect(0, 0, pageWidth, 30, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("Travel with Moeen", pageWidth / 2, 15, { align: "center" });
      doc.setFontSize(10);
      doc.setTextColor(245, 168, 26);
      doc.text("Explore the Beauty of Pakistan", pageWidth / 2, 23, { align: "center" });

      // Tour Title Section
      doc.setFillColor(245, 168, 26);
      doc.rect(0, 30, pageWidth, 25, "F");
      doc.setTextColor(28, 57, 91);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(tour.name, pageWidth / 2, 40, { align: "center" });
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`${tour.location} | ${tour.duration} Days | ${tour.transport}`, pageWidth / 2, 47, { align: "center" });
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`Starting From PKR ${displayPrice.toLocaleString()}`, pageWidth / 2, 53, { align: "center" });

      y = 65;

      // Tour Overview
      doc.setTextColor(28, 57, 91);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Tour Overview", margin, y);
      doc.setDrawColor(245, 168, 26);
      doc.setLineWidth(0.5);
      doc.line(margin, y + 2, margin + 40, y + 2);
      y += 10;

      doc.setTextColor(51, 51, 51);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      const descLines = doc.splitTextToSize(tour.description, contentWidth);
      doc.text(descLines, margin, y);
      y += descLines.length * 5 + 10;

      // Package Options
      checkNewPage(60);
      doc.setFillColor(249, 249, 249);
      doc.rect(0, y - 5, pageWidth, 10, "F");
      doc.setTextColor(28, 57, 91);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Package Options (For 2 Persons)", margin, y);
      doc.setDrawColor(245, 168, 26);
      doc.line(margin, y + 2, margin + 60, y + 2);
      y += 12;

      // Package Table Header
      doc.setFillColor(28, 57, 91);
      doc.rect(margin, y, contentWidth, 8, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("Package", margin + 3, y + 5.5);
      doc.text("Price (PKR)", margin + 45, y + 5.5);
      doc.text("Features", margin + 85, y + 5.5);
      y += 8;

      // Package Table Rows
      tour.packages.forEach((pkg, index) => {
        checkNewPage(12);
        if (index % 2 === 0) {
          doc.setFillColor(255, 255, 255);
        } else {
          doc.setFillColor(245, 245, 245);
        }
        doc.rect(margin, y, contentWidth, 10, "F");

        doc.setTextColor(28, 57, 91);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text(pkg.category, margin + 3, y + 6);

        doc.setTextColor(245, 168, 26);
        doc.text(pkg.price.toLocaleString(), margin + 45, y + 6);

        doc.setTextColor(51, 51, 51);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        const featuresText = pkg.features.slice(0, 3).join(", ");
        const featureLines = doc.splitTextToSize(featuresText, 90);
        doc.text(featureLines[0] || "", margin + 85, y + 6);

        y += 10;
      });

      y += 10;

      // Itinerary
      checkNewPage(30);
      doc.setTextColor(28, 57, 91);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Itinerary", margin, y);
      doc.setDrawColor(245, 168, 26);
      doc.line(margin, y + 2, margin + 25, y + 2);
      y += 10;

      tour.itinerary.forEach((day) => {
        checkNewPage(25);

        // Day title with yellow bar
        doc.setFillColor(245, 168, 26);
        doc.rect(margin, y - 3, 3, 15, "F");

        doc.setTextColor(28, 57, 91);
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text(`Day ${day.day}: ${day.title}`, margin + 6, y);
        y += 6;

        doc.setTextColor(51, 51, 51);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        day.highlights.forEach((item) => {
          checkNewPage(6);
          const lines = doc.splitTextToSize(`• ${item}`, contentWidth - 10);
          doc.text(lines, margin + 6, y);
          y += lines.length * 4;
        });
        y += 5;
      });

      // Included / Not Included
      checkNewPage(50);
      y += 5;
      doc.setFillColor(249, 249, 249);
      doc.rect(0, y - 5, pageWidth, 10, "F");

      const colWidth = (contentWidth - 10) / 2;

      // Included
      doc.setTextColor(28, 57, 91);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Included", margin, y);
      doc.setDrawColor(40, 167, 69);
      doc.line(margin, y + 2, margin + 25, y + 2);

      // Not Included
      doc.text("Not Included", margin + colWidth + 10, y);
      doc.setDrawColor(220, 53, 69);
      doc.line(margin + colWidth + 10, y + 2, margin + colWidth + 45, y + 2);

      y += 8;
      const startY = y;

      // Included items
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      tour.included.forEach((item) => {
        checkNewPage(6);
        doc.setTextColor(40, 167, 69);
        doc.text("✓", margin, y);
        doc.setTextColor(51, 51, 51);
        const lines = doc.splitTextToSize(item, colWidth - 10);
        doc.text(lines, margin + 6, y);
        y += lines.length * 4 + 2;
      });

      // Not Included items
      let y2 = startY;
      tour.notIncluded.forEach((item) => {
        doc.setTextColor(220, 53, 69);
        doc.text("✗", margin + colWidth + 10, y2);
        doc.setTextColor(51, 51, 51);
        const lines = doc.splitTextToSize(item, colWidth - 10);
        doc.text(lines, margin + colWidth + 16, y2);
        y2 += lines.length * 4 + 2;
      });

      y = Math.max(y, y2) + 10;

      // Footer
      checkNewPage(20);
      doc.setFillColor(28, 57, 91);
      doc.rect(0, 282, pageWidth, 15, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.text("Contact: +92 333 9981177 | Email: info@travelwithmoeen.com", pageWidth / 2, 288, { align: "center" });
      doc.text("Office: F-10 Markaz, Islamabad | www.travelwithmoeen.com", pageWidth / 2, 293, { align: "center" });

      // Save PDF
      doc.save(`${tour.name.replace(/\s+/g, "-")}-Tour.pdf`);

    } catch (error) {
      console.error("PDF generation failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Download Button */}
      <button
        onClick={handleDownloadPDF}
        disabled={isDownloading}
        className="fixed bottom-6 right-6 z-50 bg-[#1c395b] text-white px-6 py-3 rounded-full shadow-lg hover:bg-[#f5a81a] hover:text-[#1c395b] transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
      >
        {isDownloading ? (
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        )}
        {isDownloading ? "Downloading..." : "Download PDF"}
      </button>

      {/* Preview Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-[#1c395b] text-white py-6 text-center rounded-t-lg">
          <h1 className="text-3xl font-bold">Travel with Moeen</h1>
          <p className="text-[#f5a81a] mt-2">Explore the Beauty of Pakistan</p>
        </div>

        <div className="bg-[#f5a81a] text-[#1c395b] py-4 text-center">
          <h2 className="text-2xl font-bold">{tour.name}</h2>
          <p className="mt-1">{tour.location} | {tour.duration} Days | {tour.transport}</p>
          <p className="mt-1 font-bold text-lg">Starting From PKR {displayPrice.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 shadow-lg rounded-b-lg">
          <h3 className="text-xl font-bold text-[#1c395b] border-b-2 border-[#f5a81a] pb-2 mb-4">Tour Overview</h3>
          <p className="text-gray-700 leading-relaxed">{tour.description}</p>

          <h3 className="text-xl font-bold text-[#1c395b] border-b-2 border-[#f5a81a] pb-2 mb-4 mt-8">Package Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tour.packages.map((pkg, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-bold text-[#1c395b]">{pkg.category}</h4>
                <p className="text-[#f5a81a] font-bold text-lg">PKR {pkg.price.toLocaleString()}</p>
                <ul className="text-sm text-gray-600 mt-2">
                  {pkg.features.map((f, i) => <li key={i}>✓ {f}</li>)}
                </ul>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-bold text-[#1c395b] border-b-2 border-[#f5a81a] pb-2 mb-4 mt-8">Itinerary</h3>
          {tour.itinerary.map((day) => (
            <div key={day.day} className="mb-4 pl-4 border-l-4 border-[#f5a81a]">
              <h4 className="font-bold text-[#1c395b]">Day {day.day}: {day.title}</h4>
              <ul className="text-sm text-gray-700 mt-2">
                {day.highlights.map((item, i) => <li key={i}>• {item}</li>)}
              </ul>
            </div>
          ))}

          <div className="grid grid-cols-2 gap-8 mt-8">
            <div>
              <h3 className="text-lg font-bold text-[#1c395b] border-b-2 border-green-500 pb-2 mb-4">Included</h3>
              <ul className="text-sm text-gray-700">
                {tour.included.map((item, i) => <li key={i} className="mb-1">✔ {item}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1c395b] border-b-2 border-red-500 pb-2 mb-4">Not Included</h3>
              <ul className="text-sm text-gray-700">
                {tour.notIncluded.map((item, i) => <li key={i} className="mb-1">✘ {item}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
