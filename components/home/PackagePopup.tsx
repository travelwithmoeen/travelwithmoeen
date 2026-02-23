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
  imageSrc = "/images/logo/popup.jpeg",
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
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Popup - Responsive container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, type: "spring", damping: 25 }}
            className="fixed inset-4 z-50 flex items-center justify-center md:inset-8 lg:inset-12"
          >
            <div className="relative w-full max-w-[90vw] sm:max-w-md md:max-w-lg lg:max-w-xl">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute -right-2 -top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg transition-transform hover:scale-110 hover:bg-gray-100 sm:-right-3 sm:-top-3 sm:h-10 sm:w-10"
                aria-label="Close popup"
              >
                <X className="h-4 w-4 text-gray-700 sm:h-5 sm:w-5" />
              </button>

              {/* Image - Clickable with proper height constraints */}
              <div
                onClick={handleImageClick}
                className="cursor-pointer overflow-hidden rounded-xl shadow-2xl transition-transform hover:scale-[1.01] sm:rounded-2xl"
              >
                <Image
                  src={imageSrc}
                  alt="Special Tour Offer"
                  width={600}
                  height={750}
                  className="h-auto max-h-[80vh] w-full object-contain"
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
