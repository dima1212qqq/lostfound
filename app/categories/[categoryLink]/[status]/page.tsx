"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/component/app-sidebar";
import { Separator } from "@/components/ui/separator";
import ListingCard from "@/app/component/ListingCard";
import { SearchBar } from "@/app/component/SearchBar";

interface Category {
  name: string;
  link: string;
  parent?: Category;
}

interface Listing {
  id: number;
  title: string;
  description: string;
  category: Category;
  // Другие поля, если нужны
}

export default function CategoryStatusPage() {
  const { categoryLink, status } = useParams() as { categoryLink: string; status: string };
  const city = localStorage.getItem("selectedCity");

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef<HTMLDivElement | null>(null);

  // Сброс пагинации при изменении категории или статуса
  useEffect(() => {
    setListings([]);
    setPage(1);
    setHasMore(true);
  }, [categoryLink, status]);


  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const selectedCity = localStorage.getItem("selectedCity") || "";
        const url = `http://api.24lostandfound.ru/api/categories/${categoryLink}/${status}?city=${encodeURIComponent(
          selectedCity
        )}&page=${page}&size=10`;
        const response = await axios.get(url, {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        const newListings: Listing[] = response.data;
        setListings((prev) => [...prev, ...newListings]);
        if (newListings.length < 10) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("Ошибка загрузки объявлений:", error);
      } finally {
        setLoading(false);
      }
    }
    if (categoryLink && status) {
      fetchListings();
    }
  }, [categoryLink, status, page]);

  // Фильтрация дубликатов
  const uniqueListings = Array.from(new Map(listings.map(item => [item.id, item])).values());

  // Intersection Observer для ленивой загрузки
  useEffect(() => {
    if (loading) return;
    if (!hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [loading, hasMore]);

  const currentCategory = uniqueListings.length > 0 ? uniqueListings[0].category : null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 bg-white shadow px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex justify-center w-full lg:p-5">
              <SearchBar />
            </div>
          </div>
        </header>

        <main className="flex-1 bg-gradient-to-r from-slate-50 to-slate-100 p-6">

          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">
              Объявления из города {city}
            </h1>
            {uniqueListings.length === 0 && loading ? (
              <div>Загрузка...</div>
            ) : uniqueListings.length === 0 ? (
              <p>Объявлений не найдено</p>
            ) : (
              <div className="max-w-10xl mx-auto p-4">
                <div className="flex flex-wrap justify-center w-full gap-6">
                  {uniqueListings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
                <div ref={observerRef} className="h-10"></div>
                {loading && <p className="mt-4 text-center">Загрузка...</p>}
              </div>
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
