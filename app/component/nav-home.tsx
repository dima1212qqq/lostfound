"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { ChevronRight, Home, type LucideIcon } from "lucide-react";
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


export function NavHome() {
  const [items, setItems] = useState<NavItem[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get("http://192.168.0.192:8080/api/categories");
        console.log("Полученные категории:", response.data);
      } catch (error) {
        console.error("Ошибка загрузки категорий:", error);
      }
    }
    fetchCategories();
  }, []);

  return (
    <SidebarGroup>
      <SidebarMenu>
        
          <Collapsible
            asChild
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={"Главная"}>
                  {Home && <Home className="h-5 w-5" />}
                  <Link href={"/"}>
                    <span>{"Главная"}</span>
                  </Link>
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </SidebarMenuItem>
          </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
}
