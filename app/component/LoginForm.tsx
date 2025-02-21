"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [otpValue, setOtpValue] = useState("");
  const [otpSent, setOtpSent] = useState(false); // Был ли отправлен код

  // Функция входа/регистрации
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let endpoint = "";
      let payload: any = { username, password };

      if (activeTab === "login") {
        endpoint = "https://api.24lostandfound.ru/api/auth/login";
      } else if (activeTab === "register") {
        endpoint = "https://api.24lostandfound.ru/api/auth/register";
        payload.email = email;
        payload.otp = otpValue;
      }

      const response = await axios.post(endpoint, payload);

      const { token } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        console.log("Получен токен:", token);
        router.push("/");
      } else {
        alert("Ошибка: токен не получен");
      }
    } catch (error) {
      console.error("Ошибка:", error);
      alert("Ошибка авторизации/регистрации");
    }
  };

  // Функция отправки кода на почту
  const sendOtp = async () => {
    try {
        console.log(email);
        await axios.post("https://api.24lostandfound.ru/api/auth/send-otp", null, {
            params: { email }
        });
        setOtpSent(true);
    } catch (error) {
        console.error("Ошибка при отправке кода:", error);
        alert("Ошибка при отправке кода");
    }
};


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Tabs
        defaultValue="login"
        className="w-[350px]"
        onValueChange={(value) => setActiveTab(value)}
      >
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="login">Войти</TabsTrigger>
          <TabsTrigger value="register">Регистрация</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Вход</CardTitle>
              <CardDescription>
                Введите ваш юзернейм и пароль для входа
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="username">Юзернейм</Label>
                    <Input
                      id="username"
                      placeholder="dovakun"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Пароль</Label>
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Забыли пароль?
                      </a>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Введите пароль"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Войти
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Регистрация</CardTitle>
              <CardDescription>
                Введите ваш email, пароль и код подтверждения
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="username">Юзернейм</Label>
                    <Input
                      id="username"
                      placeholder="dovakun"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@mail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Пароль</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Введите пароль"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  {!otpSent ? (
                    
                    <Button type="button" className="w-full" onClick={sendOtp}>
                      Отправить код
                    </Button>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <InputOTP
                          maxLength={4}
                          value={otpValue}
                          onChange={(value) => setOtpValue(value)}
                        >
                          <div className="flex flex-auto justify-center">
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                            </InputOTPGroup>
                          </div>
                        </InputOTP>
                        <div className="text-center text-sm">
                          Введите код с почты
                        </div>
                      </div>
                      <Button
                        type="submit"
                        className="w-full"
                        disabled={otpValue.length !== 4}
                      >
                        Зарегистрироваться
                      </Button>
                    </>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
