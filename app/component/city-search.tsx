"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const cities = [
  { name: "Москва" },
  { name: "Санкт-Петербург" },
  { name: "Новосибирск" },
  { name: "Екатеринбург" },
  { name: "Казань" },
];

export function CitySearch() {
  const [selectedCity, setSelectedCity] = React.useState(cities[0].name);

 

  return (
    <div className="flex items-center gap-4">
      {/* Выбор города */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="min-w-[120px]">
            {selectedCity}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-48">
          <DropdownMenuLabel>Выберите город</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {cities.map((city) => (
            <DropdownMenuItem
              key={city.name}
              onClick={() => setSelectedCity(city.name)}
            >
              {city.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

    

    </div>
  );
}
