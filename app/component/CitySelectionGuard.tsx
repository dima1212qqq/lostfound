"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Check, Home } from "lucide-react";
import axios from "axios";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

interface CityData {
  name: string;
  logo: React.ElementType;
  plan: string;
}

interface City {
  id: number;
  name: string;
  // Другие поля, если есть
}

export function CitySelectionGuard({ children }: { children: React.ReactNode }) {
  const [cities, setCities] = useState<CityData[]>([]);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  // Загружаем города с сервера
  useEffect(() => {
    async function fetchCities() {
      try {
        const response = await axios.get("http://192.168.0.192:8080/api/city");
        const fetchedCities: CityData[] = response.data.map((city: City) => ({
          name: city.name,
          logo: Home, // используем иконку Home
          plan: "Выбери город",
        }));
        setCities(fetchedCities);
      } catch (error) {
        console.error("Ошибка при загрузке городов:", error);
      }
    }
    fetchCities();
  }, []);

  // Проверяем, выбран ли город, при монтировании
  useEffect(() => {
    const selectedCity = localStorage.getItem("selectedCity");
    if (!selectedCity) {
      setOpen(true);
    } else {
      setValue(selectedCity);
    }
  }, []);

  // Обработчик выбора города
  const handleSelect = (currentValue: string, team: CityData) => {
    const newValue = currentValue === value ? "" : currentValue;
    setValue(newValue);
    localStorage.setItem("selectedCity", team.name);
    // После выбора перезагружаем страницу, чтобы обновить контент
    window.location.reload();
  };

  // Контролируем возможность закрытия диалога:
  // Если город не выбран (value пустой), диалог остаётся открытым.
  const handleOpenChange = (newOpen: boolean) => {
    if (!value) {
      setOpen(true);
    } else {
      setOpen(newOpen);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          {/* Эта кнопка здесь может быть неактивна, поскольку диалог не закрывается, если город не выбран */}
        </DialogTrigger>
        <DialogContent className="max-w-[300px]">
          <DialogHeader>
            <DialogTitle>Выберите город</DialogTitle>
            <DialogDescription>
              Пожалуйста, выберите город, чтобы продолжить работу с сайтом.
            </DialogDescription>
          </DialogHeader>
          <Command>
            <CommandInput placeholder="Выбери город" className="h-9" />
            <CommandList>
              <CommandEmpty>Город не найден.</CommandEmpty>
              <CommandGroup>
                {cities.map((team) => (
                  <CommandItem
                    key={team.name}
                    value={team.name}
                    onSelect={(currentValue) => handleSelect(currentValue, team)}
                  >
                    {team.name}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === team.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
      {children}
    </>
  );
}

export default CitySelectionGuard;
