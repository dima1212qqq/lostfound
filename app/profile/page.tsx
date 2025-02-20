"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// Определяем интерфейс для данных пользователя
interface UserData {
  username: string;
  email: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth");
      return;
    }

    // Перенесли `fetchUserData` внутрь `useEffect`
    const fetchUserData = async () => {
      try {
        const response = await axios.get<UserData>("https://dima1212qqq-lostfounsback-3344.twc1.net/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (error) {
        console.error("Ошибка получения данных:", error);
        router.push("/auth"); // Перенаправляем на страницу авторизации при ошибке
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]); // Убрали `fetchUserData` из зависимостей

  if (loading) return <div className="p-4">Загрузка...</div>;
  if (!userData) return <div className="p-4">Нет данных пользователя</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Личный кабинет</h2>
      <p>Имя: {userData.username}</p>
      <p>Email: {userData.email}</p>
    </div>
  );
}
