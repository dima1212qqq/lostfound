"use client";

import React, { useState, useEffect } from "react";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ListingImage {
  id: number;
  imageUrl: string;
}

interface LightboxCarouselProps {
  images: ListingImage[];
  listingTitle: string;
  onClose: () => void;
}

export function LightboxCarousel({ images, listingTitle, onClose }: LightboxCarouselProps) {
  const [api, setApi] = useState<CarouselApi | undefined>(undefined);
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

  }, [api]);

  return (
    <div className=" w-full h-full">
      <Carousel setApi={setApi}>
        <CarouselContent>
          {images.map((img) => (
            <CarouselItem key={img.id} className="p-2">
              <img
                src={img.imageUrl}
                alt={listingTitle}
                className="w-full h-96 object-cover rounded" // Фиксированные размеры и обрезка через object-cover
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      {/* Индикатор слайдов */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-lg font-semibold">
        {current} / {count}
      </div>
      {/* Кнопка закрытия */}
      <Button
        variant="destructive"
        size="icon"
        onClick={onClose}
        className="absolute top-4 right-4"
      >
        &times;
      </Button>
      {/* Кнопка навигации влево */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => api && api.scrollPrev()}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white"
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>
      {/* Кнопка навигации вправо */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => api && api.scrollNext()}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white"
      >
        <ChevronRight className="w-6 h-6" />
      </Button>
    </div>
  );
}

export default LightboxCarousel;
