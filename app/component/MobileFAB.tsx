"use client";

import React from "react";
import Link from "next/link";
import { Home } from "lucide-react";

export function MobileFAB() {
  return (
    <div className="fixed bottom-4 right-4 md:hidden">
      <Link href="/">
        <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
          <Home className="w-6 h-6" />
        </button>
      </Link>
    </div>
  );
}

export default MobileFAB;
