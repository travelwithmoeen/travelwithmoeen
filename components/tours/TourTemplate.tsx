"use client";

import { useState } from "react";
import Image from "next/image";

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

// Terms and Conditions Data
const termsAndConditions = {
  paymentProcedure: {
    title: "Payment Procedure",
    content: "50% advance payment is required in order to proceed with confirmation of services; the remaining 50% is due 15 days before departure."
  },
  paymentModes: {
    title: "Payment Modes",
    cashPayment: {
      title: "Payment in Cash (Office)",
      address: "Travel with Moeen, Office No. 3 Shalimar Plaza, F-10 Markaz, Islamabad Pakistan",
      timing: "9 am to 6 pm",
      location: "https://maps.app.goo.gl/ec3UEPbGTTq8jkrH8"
    },
    onlinePayment: {
      title: "Payment Online in Company Account",
      accountTitle: "Travel with Moeen Private Limited",
      accountNo: "1010554099",
      branchCode: "0035",
      iban: "PK31ALFH0035001010554099",
      bank: "Bank Al Falah",
      branchAddress: "1-B, Awan Arcade, Jinnah Avenue, Blue Area, Islamabad, Pakistan"
    }
  },
  cancellationPolicy: {
    title: "Cancellation Policy",
    points: [
      "The amount will be returned after deduction of due service charges for airlines, hotels, transportation, etc.",
      "50% cancellation charges if cancelled 15 days before departure.",
      "70% charges if cancelled 3 days before departure.",
      "No refund after commencement of tour.",
      "Any sunk cost not mentioned above will be deducted.",
      "The refund amount will be processed in 7 working days."
    ]
  },
  priceNotInclude: {
    title: "The Price Does NOT Include",
    items: [
      "Portage",
      "Tips",
      "Laundry",
      "Telephone charges",
      "Transfers",
      "All items of a personal nature"
    ]
  }
};

export default function TourTemplate({ tour }: { tour: Tour }) {
  const [isDownloading, setIsDownloading] = useState(false);

  // Get Deluxe price from packages (first package is Deluxe)
  const deluxePackage = tour.packages.find(pkg => pkg.category === "Deluxe");
  const displayPrice = deluxePackage?.price || tour.basePrice;

  // Helper function to load image as base64
  const loadImageAsBase64 = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/png"));
        } else {
          reject(new Error("Could not get canvas context"));
        }
      };
      img.onerror = reject;
      img.src = url;
    });
  };

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

      // Load logo image
      let logoBase64: string | null = null;
      try {
        logoBase64 = await loadImageAsBase64("/images/twm-logo.webp");
      } catch (err) {
        console.warn("Could not load logo for PDF:", err);
      }

      // Header
      doc.setFillColor(28, 57, 91);
      doc.rect(0, 0, pageWidth, 35, "F");

      // Calculate centered position for logo + text block
      const logoSize = 20;
      const gapBetween = 5;
      const textWidth = 58; // Approximate width of "Travel with Moeen" text
      const totalBlockWidth = logoSize + gapBetween + textWidth;
      const blockStartX = (pageWidth - totalBlockWidth) / 2;

      // Add logo if available (centered with text)
      if (logoBase64) {
        doc.addImage(logoBase64, "PNG", blockStartX, 7, logoSize, logoSize);
      }

      // Position text next to logo
      const textX = logoBase64 ? blockStartX + logoSize + gapBetween : pageWidth / 2;
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("Travel with Moeen", textX, 16, { align: logoBase64 ? "left" : "center" });
      doc.setFontSize(10);
      doc.setTextColor(245, 168, 26);
      doc.text("Explore the Beauty of Pakistan", textX, 24, { align: logoBase64 ? "left" : "center" });

      // Tour Title Section
      doc.setFillColor(245, 168, 26);
      doc.rect(0, 35, pageWidth, 25, "F");
      doc.setTextColor(28, 57, 91);
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text(tour.name, pageWidth / 2, 45, { align: "center" });
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`${tour.location} | ${tour.duration} Days | ${tour.transport}`, pageWidth / 2, 52, { align: "center" });
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`Starting From PKR ${displayPrice.toLocaleString()}`, pageWidth / 2, 58, { align: "center" });

      y = 70;

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

      y = Math.max(y, y2) + 15;

      // Terms and Conditions Section
      checkNewPage(30);
      doc.setFillColor(249, 249, 249);
      doc.rect(0, y - 5, pageWidth, 10, "F");
      doc.setTextColor(28, 57, 91);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Terms & Conditions", margin, y);
      doc.setDrawColor(245, 168, 26);
      doc.line(margin, y + 2, margin + 45, y + 2);
      y += 12;

      // Payment Procedure
      checkNewPage(20);
      doc.setTextColor(28, 57, 91);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(termsAndConditions.paymentProcedure.title, margin, y);
      y += 6;
      doc.setTextColor(51, 51, 51);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      const paymentLines = doc.splitTextToSize(termsAndConditions.paymentProcedure.content, contentWidth);
      doc.text(paymentLines, margin, y);
      y += paymentLines.length * 4 + 8;

      // Payment Modes
      checkNewPage(40);
      doc.setTextColor(28, 57, 91);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(termsAndConditions.paymentModes.title, margin, y);
      y += 8;

      // Cash Payment
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(termsAndConditions.paymentModes.cashPayment.title, margin, y);
      y += 5;
      doc.setTextColor(51, 51, 51);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(termsAndConditions.paymentModes.cashPayment.address, margin, y);
      y += 4;
      doc.text(`(${termsAndConditions.paymentModes.cashPayment.timing})`, margin, y);
      y += 8;

      // Online Payment
      checkNewPage(35);
      doc.setTextColor(28, 57, 91);
      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(termsAndConditions.paymentModes.onlinePayment.title, margin, y);
      y += 6;
      doc.setTextColor(51, 51, 51);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(`Account Title: ${termsAndConditions.paymentModes.onlinePayment.accountTitle}`, margin, y);
      y += 4;
      doc.text(`Account No: ${termsAndConditions.paymentModes.onlinePayment.accountNo}`, margin, y);
      y += 4;
      doc.text(`Branch Code: ${termsAndConditions.paymentModes.onlinePayment.branchCode}`, margin, y);
      y += 4;
      doc.text(`IBAN: ${termsAndConditions.paymentModes.onlinePayment.iban}`, margin, y);
      y += 4;
      doc.text(`Bank: ${termsAndConditions.paymentModes.onlinePayment.bank}`, margin, y);
      y += 4;
      doc.setFontSize(8);
      doc.text(termsAndConditions.paymentModes.onlinePayment.branchAddress, margin, y);
      y += 10;

      // Cancellation Policy
      checkNewPage(35);
      doc.setTextColor(28, 57, 91);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(termsAndConditions.cancellationPolicy.title, margin, y);
      y += 6;
      doc.setTextColor(51, 51, 51);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      termsAndConditions.cancellationPolicy.points.forEach((point) => {
        checkNewPage(6);
        const lines = doc.splitTextToSize(`• ${point}`, contentWidth);
        doc.text(lines, margin, y);
        y += lines.length * 4 + 1;
      });
      y += 6;

      // Price Not Include
      checkNewPage(20);
      doc.setTextColor(28, 57, 91);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text(termsAndConditions.priceNotInclude.title, margin, y);
      y += 6;
      doc.setTextColor(51, 51, 51);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      const notIncludeText = termsAndConditions.priceNotInclude.items.join(", ") + ", and also any other items not specifically mentioned in the package inclusions.";
      const notIncludeLines = doc.splitTextToSize(notIncludeText, contentWidth);
      doc.text(notIncludeLines, margin, y);
      y += notIncludeLines.length * 4 + 10;

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
          <div className="flex items-center justify-center gap-4">
            <Image
              src="/images/twm-logo.webp"
              alt="Travel with Moeen Logo"
              width={90}
              height={100}
              className="rounded-full"
            />
            <div>
              <h1 className="text-3xl font-bold">Travel with Moeen</h1>
              <p className="text-[#f5a81a] mt-1">Explore the Beauty of Pakistan</p>
            </div>
          </div>
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

          {/* Terms and Conditions Section */}
          <div className="mt-10 pt-8 border-t-2 border-gray-200">
            <h3 className="text-xl font-bold text-[#1c395b] border-b-2 border-[#f5a81a] pb-2 mb-6">Terms & Conditions</h3>

            {/* Payment Procedure */}
            <div className="mb-6">
              <h4 className="font-bold text-[#1c395b] mb-2">{termsAndConditions.paymentProcedure.title}</h4>
              <p className="text-sm text-gray-700">{termsAndConditions.paymentProcedure.content}</p>
            </div>

            {/* Payment Modes */}
            <div className="mb-6">
              <h4 className="font-bold text-[#1c395b] mb-3">{termsAndConditions.paymentModes.title}</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Cash Payment */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-[#1c395b] mb-2">{termsAndConditions.paymentModes.cashPayment.title}</h5>
                  <p className="text-sm text-gray-700">{termsAndConditions.paymentModes.cashPayment.address}</p>
                  <p className="text-sm text-gray-600">({termsAndConditions.paymentModes.cashPayment.timing})</p>
                  <a
                    href={termsAndConditions.paymentModes.cashPayment.location}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#f5a81a] hover:underline mt-1 inline-block"
                  >
                    View on Map →
                  </a>
                </div>

                {/* Online Payment */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-semibold text-[#1c395b] mb-2">{termsAndConditions.paymentModes.onlinePayment.title}</h5>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p><span className="font-medium">Account Title:</span> {termsAndConditions.paymentModes.onlinePayment.accountTitle}</p>
                    <p><span className="font-medium">Account No:</span> {termsAndConditions.paymentModes.onlinePayment.accountNo}</p>
                    <p><span className="font-medium">Branch Code:</span> {termsAndConditions.paymentModes.onlinePayment.branchCode}</p>
                    <p><span className="font-medium">IBAN:</span> {termsAndConditions.paymentModes.onlinePayment.iban}</p>
                    <p><span className="font-medium">Bank:</span> {termsAndConditions.paymentModes.onlinePayment.bank}</p>
                    <p className="text-xs text-gray-500 mt-1">{termsAndConditions.paymentModes.onlinePayment.branchAddress}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="mb-6">
              <h4 className="font-bold text-[#1c395b] mb-2">{termsAndConditions.cancellationPolicy.title}</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                {termsAndConditions.cancellationPolicy.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Not Include */}
            <div className="mb-4">
              <h4 className="font-bold text-[#1c395b] mb-2">{termsAndConditions.priceNotInclude.title}</h4>
              <p className="text-sm text-gray-700">
                {termsAndConditions.priceNotInclude.items.join(", ")}, and also any other items not specifically mentioned in the package inclusions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
