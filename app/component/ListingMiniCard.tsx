"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ListingImage {
    id: number;
    imageUrl: string;
}

interface Listing {
    id: number;
    title: string;
    description: string;
    // imageUrl теперь загружается отдельно
  }

interface ListingMiniCardProps {
    listing: Listing;
}

/**
 * Карточка объявления, содержащая мини-карусель (1 фото за раз),
 * фиксированный размер, возможность свайпа на мобильных.
 */
export function ListingMiniCard({ listing }: ListingMiniCardProps) {
    const [images, setImages] = useState<ListingImage[]>([]);
    const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

    useEffect(() => {
        // Загрузка фото для данного объявления
        async function fetchImages() {
            try {
                const response = await axios.get<ListingImage[]>(
                    `http://192.168.0.192:8080/api/listings/${listing.id}/images`
                );
                setImages(response.data);
                console.log("ФОТОООО")
                console.log(response.data)
            } catch (error) {
                console.error("Ошибка загрузки изображений:", error);
            }
        }
        fetchImages();
    }, [listing.id]);

    const [currentSlide, setCurrentSlide] = useState(1);
    const [totalSlides, setTotalSlides] = useState(0);
    useEffect(() => {
      if (!carouselApi) return;
      setTotalSlides(carouselApi.scrollSnapList().length);
      setCurrentSlide(carouselApi.selectedScrollSnap() + 1);
      const unsub = carouselApi.on("select", () => {
        setCurrentSlide(carouselApi.selectedScrollSnap() + 1);
      });
      return () => {
        if (typeof unsub === "function") unsub();
      };
    }, [carouselApi]);

    return (
        <Link href={`/listings/${listing.id}`}>
            {/* 
        Фиксированный размер карточки: 
        w-72 (ширина ~18rem), h-[28rem] (высота 28rem) - пример, подберите по вкусу
      */}
            <Card className="w-72 h-[28rem] shadow-lg hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
                <CardContent className="flex flex-col h-full p-0">
                    {/* Верхняя часть карточки: мини-карусель */}
                    <div className="relative w-full h-40 bg-gray-100">
                        {images.length > 0 ? (
                            <Carousel
                                setApi={setCarouselApi}
                                opts={{ align: "start" }}
                                className="w-full h-full"
                            >
                                <CarouselContent>
                                    {images.map((img) => (
                                        <CarouselItem key={img.id} className="w-full h-full">
                                            <img
                                                src={img.imageUrl}
                                                alt={listing.title}
                                                className="w-56 h-56 object-scale-down"
                                            />
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                            </Carousel>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                                Нет фото
                            </div>
                        )}

                        {/* Кнопки навигации (видны только на десктопе) */}
                        {images.length > 1 && (
                            <>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => carouselApi?.scrollPrev()}
                                    className="hidden md:block absolute left-2 top-1/2 transform -translate-y-1/2 text-white"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => carouselApi?.scrollNext()}
                                    className="hidden md:block absolute right-2 top-1/2 transform -translate-y-1/2 text-white"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Нижняя часть карточки: инфо */}
                    <div className="flex flex-col flex-grow p-4">
                        <h2 className="text-base font-semibold text-gray-900 mb-1 line-clamp-2">
                            {listing.title}
                        </h2>
                        
                        <p className="text-xs text-gray-600 line-clamp-3 flex-grow">
                            {listing.description}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

export default ListingMiniCard;
