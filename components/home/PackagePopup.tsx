"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface PackagePopupProps {
  triggerRef: React.RefObject<HTMLElement | null>;
  imageSrc?: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
}

export function PackagePopup({
  triggerRef,
  imageSrc = "/images/Picture1.jpg",
  whatsappNumber = "923339981177",
  whatsappMessage = "Hi, I am interested in your tour packages. Please share more details.",
}: PackagePopupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  // Check if popup was already shown in this session
  useEffect(() => {
    const wasShown = sessionStorage.getItem("packagePopupShown");
    if (wasShown) {
      setHasTriggered(true);
    }
  }, []);

  // Intersection Observer to detect when PackageCalculator is in view
  useEffect(() => {
    if (!triggerRef.current || hasTriggered) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasTriggered) {
            setIsOpen(true);
            setHasTriggered(true);
            sessionStorage.setItem("packagePopupShown", "true");
          }
        });
      },
      {
        threshold: 0.3,
      }
    );

    observer.observe(triggerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [triggerRef, hasTriggered]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleImageClick = useCallback(() => {
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
    setIsOpen(false);
  }, [whatsappNumber, whatsappMessage]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Simple backdrop - click to close */}
          <div
            className="fixed inset-0 z-50"
            onClick={handleClose}
          />

          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, type: "spring", damping: 25 }}
            className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative max-w-[95vw] md:max-w-xl lg:max-w-2xl">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute -right-3 -top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-transform hover:scale-110 hover:bg-gray-100"
                aria-label="Close popup"
              >
                <X className="h-5 w-5 text-gray-700" />
              </button>

              {/* Image - Clickable */}
              <div
                onClick={handleImageClick}
                className="cursor-pointer overflow-hidden rounded-2xl shadow-2xl transition-transform hover:scale-[1.02]"
              >
                <Image
                  src={imageSrc}
                  alt="Special Tour Offer"
                  width={700}
                  height={800}
                  className="h-auto w-full object-cover"
                  priority
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
