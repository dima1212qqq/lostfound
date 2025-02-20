import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// Предполагаем, что категории уже загружены и хранятся в состоянии categories
// Тип Category определен выше
interface Category {
    id: number;
    link: string;
    name: string;
    parent: Category | null; // Родительская категория (null, если это категория первого уровня)
    imageUrl?: string;
  }
  
export function CategorySelector({
  categories,
  onChange,
}: {
  categories: Category[];
  onChange: (parentLink: string, childLink: string) => void;
}) {
  const [selectedParent, setSelectedParent] = useState<string>("");
  const [selectedChild, setSelectedChild] = useState<string>("");

  // Если выбран родитель, сбрасываем выбранную подкатегорию
  useEffect(() => {
    setSelectedChild("");
  }, [selectedParent]);

  // Обработчик изменения выбора
  useEffect(() => {
    // Вызываем onChange только если выбрана подкатегория
    if (selectedParent && selectedChild) {
      onChange(selectedParent, selectedChild);
    }
  }, [selectedParent, selectedChild, onChange]);

  return (
    <div className="space-y-4">
      {/* Выбор родительской категории */}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="parentCategory" className="text-right">
          Категория
        </Label>
        <Select
          value={selectedParent}
          onValueChange={setSelectedParent}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue className="w-full" placeholder="Выберите категорию" />
          </SelectTrigger>
          <SelectContent className="w-full">
            {categories
              .filter((cat) => cat.parent === null)
              .map((cat) => (
                <SelectItem key={cat.id} value={cat.link}>
                  {cat.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
      {/* Если выбрана родительская категория, показываем выбор подкатегории */}
      {selectedParent && (
        <div className="grid grid-cols-4 items-center gap-4 w-full">
          <Label htmlFor="childCategory" className="text-right">
            Подкатегория
          </Label>
          <Select
            value={selectedChild}
            onValueChange={setSelectedChild}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Выберите подкатегорию" />
            </SelectTrigger>
            <SelectContent>
              {categories
                .filter(
                  (cat) =>
                    cat.parent !== null && cat.parent.link === selectedParent
                )
                .map((cat) => (
                  <SelectItem key={cat.id} value={cat.link}>
                    {cat.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
