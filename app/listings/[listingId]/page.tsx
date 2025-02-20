"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/component/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Listing {
  id: number;
  title: string;
  description: string;
  phone: string;
  reward?: string;
}

interface ListingImage {
  id: number;
  imageUrl: string;
}

export default function ListingDetailPage() {
  const { listingId } = useParams() as { listingId: string };
  const [listing, setListing] = useState<Listing | null>(null);
  const [images, setImages] = useState<ListingImage[]>([]);
  const [loading, setLoading] = useState(true);

  // Embla Carousel
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  // Управление слайдером
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  useEffect(() => {
    async function fetchData() {
      try {
        const listingResponse = await axios.get<Listing>(
          `http://192.168.0.192:8080/api/listings/${listingId}`
        );
        setListing(listingResponse.data);

        const imagesResponse = await axios.get<ListingImage[]>(
          `http://192.168.0.192:8080/api/listings/${listingId}/images`
        );
        setImages(imagesResponse.data);
      } catch (error) {
        console.error("Ошибка загрузки объявления:", error);
      } finally {
        setLoading(false);
      }
    }
    if (listingId) {
      fetchData();
    }
  }, [listingId]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Загрузка...
      </div>
    );
  if (!listing)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Объявление не найдено
      </div>
    );

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Шапка */}
        <header className="flex h-16 shrink-0 items-center gap-2 bg-white shadow px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Lost&amp;Found</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Основное содержимое */}
        <main className="min-h-screen p-8 bg-gradient-to-r from-slate-50 to-slate-100">
          <div className="lg:max-w-10xl mx-auto bg-white rounded-lg shadow-2xl overflow-hidden md:justify-center md:items-center">
            <div className="flex flex-col md:flex-row justify-center items-center">
              {/* Левая колонка – Embla Carousel */}
              <div className="w-full md:w-1/2 p-4 relative">
                {images.length > 0 ? (
                  <div className="overflow-hidden relative" ref={emblaRef}>
                    <div className="flex">
                      {images.map((img) => (
                        <div className="min-w-full flex justify-center items-center" key={img.id}>
                          <img
                            src={img.imageUrl}
                            alt={listing.title}
                            className="rounded-lg object-cover max-h-[400px]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-96 flex items-center justify-center text-gray-500">
                    Нет изображений
                  </div>
                )}

                {/* Кнопки управления */}
                {images.length > 1 && (
                  <>
                    <button
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow-md"
                      onClick={scrollPrev}
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-white rounded-full shadow-md"
                      onClick={scrollNext}
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>

              {/* Правая колонка – информация об объявлении */}
              <div className="md:w-1/2 p-8 flex flex-col justify-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">{listing.title}</h1>
                <p className="text-gray-700 text-lg mb-6">{listing.description}</p>
                <p className="text-xl font-semibold text-gray-900 mb-6">Телефон: {listing.phone}</p>
                {listing.reward && (
                  <p className="text-xl font-semibold text-green-700 mb-6">
                    Вознаграждение: {listing.reward}
                  </p>
                )}
                <Button
                  variant="outline"
                  className="self-start"
                  onClick={() => window.history.back()}
                >
                  Вернуться назад
                </Button>
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
