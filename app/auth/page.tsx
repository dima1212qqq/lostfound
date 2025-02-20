"use client";

import { LoginForm } from "../component/LoginForm";


export default function AuthPage() {
  return (
    <div className="flex min-h-[100vh] w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
