"use client";

import * as React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import { NavHome } from "./nav-home";

// Интерфейсы для города и данных команды
interface City {
  id: number;
  name: string;
}

interface CityData {
  name: string;
  logo: React.ElementType;
  plan: string;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userData, setUserData] = React.useState<any | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [cities, setCities] = React.useState<CityData[]>([]);

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUserData(null);
          return;
        }

        const response = await axios.get("http://192.168.0.192:8080/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Ошибка загрузки пользователя:", error);
        setUserData(null); // Оставляем пользователя гостем
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  React.useEffect(() => {
    async function fetchCities() {
      try {
        const response = await axios.get("http://192.168.0.192:8080/api/city");
        const fetchedCities: CityData[] = response.data.map((city: City) => ({
          name: city.name,
          logo: Home, // Иконка города
          plan: "Выбери город",
        }));
        setCities(fetchedCities);
      } catch (error) {
        console.error("Ошибка при загрузке городов:", error);
      }
    }
    fetchCities();
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={cities} />
      </SidebarHeader>
      <SidebarContent>
        <NavHome />
        <NavMain />
        <NavProjects />
      </SidebarContent>
      <SidebarFooter>
        {!isLoading && <NavUser user={userData} />} {/* Показываем пользователя только после загрузки */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
