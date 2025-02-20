"use client";

import * as React from "react";
import { Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const cities = [
  { name: "Москва" },
  { name: "Санкт-Петербург" },
  { name: "Новосибирск" },
  { name: "Екатеринбург" },
  { name: "Казань" },
];

export function CitySearch() {
  const [selectedCity, setSelectedCity] = React.useState(cities[0].name);
  const [searchTerm, setSearchTerm] = React.useState("");

  const handleSearch = () => {
    // Здесь можно выполнить навигацию или отправку запроса с выбранным городом и поисковым запросом.
    console.log("Поиск в городе:", selectedCity, "по запросу:", searchTerm);
    // Например, вы можете использовать useRouter для перехода:
    // router.push(`/search?city=${selectedCity}&query=${searchTerm}`);
  };

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
