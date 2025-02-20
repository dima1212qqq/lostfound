"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import ListingCard from "./ListingCard";

interface Listing {
  id: number;
  title: string;
  description: string;
  // Другие поля, если нужны
}

interface LazyListingCardsProps {
  listings: Listing[];
}

function useInView(ref: React.RefObject<HTMLElement>, options?: IntersectionObserverInit) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setInView(true);
          // Если нужно, чтобы анимация срабатывала только один раз, сразу отписываемся:
          observer.unobserve(entry.target);
        }
      });
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options]);

  return inView;
}

function LazyListingCard({ listing }: { listing: Listing }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { threshold: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="w-full sm:w-72 mb-6"  // На мобильных занимает всю ширину, на sm – фиксированная
    >
      <ListingCard listing={listing} />
    </motion.div>
  );
}

export function LazyListingCards({ listings }: LazyListingCardsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-6">
      {listings.map((listing) => (
        <LazyListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}

export default LazyListingCards;
