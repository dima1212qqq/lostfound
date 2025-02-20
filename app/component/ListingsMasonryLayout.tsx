"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import Masonry from "react-masonry-css";
import ListingCard from "@/app/component/ListingCard"; // карточка объявления

interface Listing {
  id: number;
  title: string;
  description: string;
  phone: string;
  // другие поля, если нужны
}

export default function ListingsMasonryLayout() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      try {
        const response = await axios.get("http://api.24lostandfound.ru/api/listings");
        setListings(response.data);
      } catch (error) {
        console.error("Ошибка загрузки объявлений:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, []);

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1,
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="p-6">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </Masonry>
    </div>
  );
}
