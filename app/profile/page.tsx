"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем наличие токена
    const token = localStorage.getItem("token");
    if (!token) {
      // Если нет токена, редиректим на /auth
      router.push("/auth");
      return;
    }else{
      fetchUserData(token);
    }
  }, []);

  const fetchUserData = async (token: string) => {
    try {
      // Пример: GET http://localhost:8080/api/auth/me
      // Нужно передать заголовок Authorization: Bearer <token>
      const response = await axios.get("http://192.168.0.192:8080/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(response.data);
    } catch (error) {
      console.error(error);
      // Если ошибка (например, токен невалиден), можно редиректить на /auth
      router.push("/auth");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4">Загрузка...</div>;
  }

  if (!userData) {
    return <div className="p-4">Нет данных пользователя</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Личный кабинет</h2>
      <p>Имя: {userData.username}</p>
      <p>Email: {userData.email}</p>
      {/* Другие поля */}
    </div>
  );
}
