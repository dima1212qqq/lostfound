"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

interface Category {
  id: number;
  link: string;
  name: string;
  parent_id: number | null;
  imageUrl?: string;
  // Если сервер возвращает вложенный объект parent
  parent?: {
    id: number;
    name: string;
  };
}

export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items: NavItem[];
}

const ImageIcon = ({ src, alt }: { src: string; alt: string }) => (
  <img src={src} alt={alt} className="h-5 w-5 object-contain" />
);

function transformCategories(categories: Category[]): NavItem[] {
  const categoryMap: { [key: number]: NavItem } = {};
  const navItems: NavItem[] = [];

  categories.forEach((cat) => {
    categoryMap[cat.id] = {
      title: cat.name,
      url: `/categories/${cat.link}/lost`,
      icon: cat.imageUrl ? () => <ImageIcon src={cat.imageUrl} alt={cat.name} /> : undefined,
      items: [],
    };
  });

  categories.forEach((cat) => {
    if (cat.parent && cat.parent.id) {
      const parentId = cat.parent.id;
      const parent = categoryMap[parentId];
      if (parent) {
        parent.items.push(categoryMap[cat.id]);
      } else {
        navItems.push(categoryMap[cat.id]);
      }
    } else if (cat.parent_id) {
      const parent = categoryMap[cat.parent_id];
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

export function NavMain() {
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
                  {item.icon && <item.icon className="h-5 w-5" />}
                  <Link href={item.url}>
                    <span>{item.title}</span>
                  </Link>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-100" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <Link href={subItem.url}>
                          <span>{subItem.title}</span>
                        </Link>
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
