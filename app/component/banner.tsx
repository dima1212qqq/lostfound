import React from "react";
import { Button } from "@/components/ui/button";
import ListingFormDialog from "./ListingFormDialog";

export function Banner() {
  return (
    <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg mb-8 justify-center">
      {/* Фоновое изображение */}
      <img
        src="https://s3.timeweb.cloud/f0f2f89c-53b85c60-a9e6-46ca-8b1e-1cf35fae486d/DALL·E 2025-02-18 19.52.09 - A wide banner depicting a lost and found theme. The image features a soft, heartwarming scene of a city park with a lost pet poster on a lamppost, a w-fotor-20250218195610.jpg"
        alt="Banner"
        className="object-cover w-full h-full"
      />
      {/* Оверлей с затемнением */}
      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
        {/* Дополнительный заголовок, если нужно */}
        <h2 className="text-3xl text-wrap justify-center flex text-center font-bold text-white mb-6">
          Найдите или разместите объявление
        </h2>
        {/* Кнопки */}
        <div className="flex gap-4 ">
          <ListingFormDialog type="found" />
          <ListingFormDialog type="lost" />
        </div>
      </div>
    </div>
  );
}
