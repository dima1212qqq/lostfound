"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import ListingCard from "./ListingCard"; // Импортируем компонент карточки

interface Listing {
  id: number;
  title: string;
  description: string;
  // imageUrl теперь загружается отдельно
}

interface CategoryCarouselProps {
  title: string;
  categoryLink: string;
}

export function CategoryCarousel({ title, categoryLink }: CategoryCarouselProps) {
  const [activeStatus, setActiveStatus] = useState("lost");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      try {
        const selectedCity = localStorage.getItem("selectedCity") || "";
        const url = `https://api.24lostandfound.ru/api/categories/${categoryLink}/${activeStatus}?city=${encodeURIComponent(selectedCity)}`;
        const response = await axios.get(url);
        setListings(response.data);
      } catch (error) {
        console.error("Ошибка загрузки объявлений:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, [categoryLink, activeStatus]);

  return (
    <div className="w-[360px]  flex flex-col items-center bg-white rounded-lg shadow p-4">
      <h2 className="mb-4 text-center text-xl font-semibold text-gray-700">{title}</h2>

      <Tabs
        defaultValue="lost"
        className="w-full mb-4"
        onValueChange={(value) => setActiveStatus(value)}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lost">Ищу</TabsTrigger>
          <TabsTrigger value="found">Нашёл</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div>Загрузка объявлений...</div>
      ) : listings.length === 0 ? (
        <p className="text-center">Объявлений не найдено</p>
      ) : (
        <Carousel opts={{ align: "start" }} className="w-[300px] max-w-sm">
          <CarouselContent>
            {listings.map((listing) => (
              <CarouselItem key={listing.id} className="p-2">
                <ListingCard listing={listing} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}
    </div>
  );
}

export default CategoryCarousel;
