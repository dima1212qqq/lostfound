"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CategorySelector } from "./CategorySelector";

interface Category {
  id: number;
  link: string;
   name: string;
  parent: Category | null;
  imageUrl?: string;
}

interface ListingFormDialogProps {
  type: "lost" | "found";
}

export function ListingFormDialog({ type }: ListingFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [reward, setReward] = useState(""); // Новое поле для вознаграждения

  // Храним выбранные файлы в виде массива
  const [files, setFiles] = useState<File[]>([]);

  // Загружаем категории с сервера при монтировании
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get("http://192.168.0.192:8080/api/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Ошибка загрузки категорий:", error);
      }
    }
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("type", type);
    formData.append("category", selectedCategory);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("phone", phone);

    // Если поле вознаграждения пустое, отправляем "нет"
    const rewardValue = reward.trim() === "" ? "нет" : reward.trim();
    formData.append("reward", rewardValue);

    // Получаем название города из localStorage и добавляем в FormData
    const selectedCity = localStorage.getItem("selectedCity") || "";
    formData.append("city", selectedCity);

    files.forEach((file) => {
      formData.append("images", file);
    });

    // Получаем токен из localStorage
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post("http://192.168.0.192:8080/api/listings", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      console.log("Объявление создано:", response.data);
    } catch (error) {
      console.error("Ошибка отправки объявления:", error);
    } finally {
      setOpen(false);
    }
  };

  // Обработчик выбора файлов
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    }
  };

  // Функция для удаления файла по индексу
  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="px-6 py-3 lg:w-[300px]">
          {type === "lost" ? "Я ищу" : "Я нашёл"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {type === "lost" ? "Поиск объявления" : "Размещение объявления"}
          </DialogTitle>
          <DialogDescription>
            {type === "lost"
              ? "Заполните форму для поиска объявления."
              : "Заполните форму для размещения объявления."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {/* Выбор категории */}
          <div className="grid gap-4">
            <CategorySelector
              categories={categories}
              onChange={(parentLink, childLink) => {
                setSelectedCategory(childLink);
                console.log("Выбрана категория:", parentLink, childLink);
              }}
            />
          </div>
          {/* Поле заголовка */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Заголовок
            </Label>
            <Input
              id="title"
              placeholder="Введите заголовок объявления"
              className="col-span-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          {/* Поле описания */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Описание
            </Label>
            <Input
              id="description"
              placeholder="Введите описание"
              className="col-span-3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          {/* Поле телефона */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Телефон
            </Label>
            <Input
              id="phone"
              placeholder="Введите номер телефона"
              className="col-span-3"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          {/* Поле вознаграждения */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reward" className="text-right">
              Награда
            </Label>
            <Input
              id="reward"
              placeholder="Укажите сумму, или подарок"
              className="col-span-3"
              value={reward}
              onChange={(e) => setReward(e.target.value)}
            />
          </div>
          {/* Загрузка фото */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="images" className="text-right">
              Фото
            </Label>
            <div className="col-span-3 flex flex-col gap-2">
              <Input id="images" type="file" onChange={handleFileChange} multiple />
              {/* Превью выбранных файлов */}
              {files.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {files.map((file, index) => {
                    const objectUrl = URL.createObjectURL(file);
                    return (
                      <div key={index} className="relative">
                        <img
                          src={objectUrl}
                          alt={`Preview ${index}`}
                          className="w-24 h-24 object-cover rounded"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => removeFile(index)}
                          className="absolute top-0 right-0"
                        >
                          &times;
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Отмена
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ListingFormDialog;
