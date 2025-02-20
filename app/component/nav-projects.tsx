"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import { JSX } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react";
import axios from "axios";

interface Category {
  id: number;
  link: string;
  name: string;
  parent_id: number | null;
  imageUrl?: string;
}

// Интерфейс для навигационного элемента
export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon | JSX.Element;
  isActive?: boolean;
  items: NavItem[];
}


// Функция для преобразования плоского списка категорий в иерархическую структуру
const ImageIcon: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
  <img src={src} alt={alt} className="h-5 w-5 object-contain" />
);


function transformCategories(categories: Category[]): NavItem[] {
  const categoryMap: { [key: number]: NavItem } = {};
  const navItems: NavItem[] = [];

  // Создаем объект для каждой категории
  categories.forEach((cat) => {
    categoryMap[cat.id] = {
      title: cat.name,
      url: `/categories/${cat.link}/found`, // можно настроить URL по необходимости
      icon: cat.imageUrl ? <ImageIcon src={cat.imageUrl || ""} alt={cat.name} /> : undefined,
      items: [],
    };
  });

  // Организуем иерархию
  categories.forEach((cat) => {
  
    if ((cat as any).parent && (cat as any).parent.id) {
      const parentId = (cat as any).parent.id;
      const parent = categoryMap[parentId];
      if (parent) {
        parent.items.push(categoryMap[cat.id]);
      } else {
        navItems.push(categoryMap[cat.id]);
      }
    } else {
      navItems.push(categoryMap[cat.id]);
    }
  });

  return navItems;
}
export function NavProjects() {
  const [items, setItems] = useState<NavItem[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get("http://192.168.0.192:8080/api/categories");
        console.log("Полученные категории:", response.data);
        const categories: Category[] = response.data;
        const transformed = transformCategories(categories);
        setItems(transformed);
      } catch (error) {
        console.error("Ошибка загрузки категорий:", error);
      }
    }
    fetchCategories();
  }, []);


  return (
    <SidebarGroup>
      <SidebarGroupLabel>Нашёл</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {typeof item.icon === "function" ? (
                    <item.icon className="h-5 w-5" />
                  ) : (
                    item.icon // Рендерим картинку, если это не LucideIcon
                  )}
                  <a href={item.url}>
                    <span>{item.title}</span>
                  </a>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-100" />
                </SidebarMenuButton>

              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <a href={subItem.url}>
                          <span>{subItem.title}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
