"use client";

import * as React from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./component/app-sidebar";
import { Banner } from "./component/banner";
import { CategoryCarousel } from "./component/CategoryCarousel";

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Шапка */}
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-white shadow">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Lost&Found</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Главная</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Основное содержимое */}
        <main className="flex-1 bg-gradient-to-r from-slate-50 to-slate-100 p-6">
          <div className=" flex flex-wrap items-start justify-center gap-12 w-full">
            {/* Карточка с каруселью для животных */}
            <Banner />
            <CategoryCarousel title="Недавнее из категории «Животные»" categoryLink="animals" />
            <CategoryCarousel title="Недавнее из категории «Электроника»" categoryLink="electronica" />
            <CategoryCarousel title="Недавнее из категории «Документы»" categoryLink="document" />
          </div>
        </main>
      </SidebarInset>
      </SidebarProvider>
  );
}

