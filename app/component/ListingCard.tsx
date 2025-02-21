"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

interface ListingImage {
    id: number;
    imageUrl: string;
}

interface Listing {
    id: number;
    title: string;
    description: string;
    imageUrl?: string;
    // Другие поля, если нужны
}

interface ListingCardProps {
    listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        async function fetchImages() {
            try {
                const response = await axios.get(
                    `https://api.24lostandfound.ru/api/listings/${listing.id}/images`
                );
                const images: ListingImage[] = response.data;
                if (images && images.length > 0) {
                    setImageUrl(images[0].imageUrl);
                }
            } catch (error) {
                console.error("Ошибка загрузки изображений:", error);
            }
        }
        fetchImages();
    }, [listing.id]);

    return (
        <Link href={`/listings/${listing.id}`}>
            <Card className="shadow-lg hover:shadow-2xl w-[300px] h-80 transition-shadow duration-300 cursor-pointer">
                <CardContent className="flex flex-col">
                    {imageUrl && (
                        <div className="w-full overflow-hidden rounded-t aspect-[3/2]">
                            {/* Используем aspect-square, чтобы фото сохраняло соотношение сторон, либо aspect-video */}
                            <div className="aspect-square">
                                <img
                                    src={imageUrl}
                                    alt={listing.title}
                                    className="w-full h-full object-scale-down p-2"
                                />
                            </div>
                        </div>
                    )}
                    <div className="p-4">
                        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                            {listing.title}
                        </h2>
                        <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                            {listing.description}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

export default ListingCard;
