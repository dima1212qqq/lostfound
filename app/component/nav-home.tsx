"use client";

import * as React from "react";
import {  useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import {  Home, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";



export interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items: NavItem[];
}




export function NavHome() {

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get("https://dima1212qqq-lostfounsback-3344.twc1.net/api/categories");
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
