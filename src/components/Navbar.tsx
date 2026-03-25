"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/utils/supabase";

export const Navbar = () => {
  const { user, role } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/"; // Полная перезагрузка для сброса стейта
  };

  return (
    <nav className="border-b bg-white px-8 py-4 flex justify-between items-center">
      <Link href="/" className="font-bold text-xl text-blue-600">
        🌳 FamilyTree
      </Link>
      <div className="flex gap-6 items-center">
        <Link href="/tree" className="text-sm font-medium hover:text-blue-600">
          Древо
        </Link>
        <Link
          href="/people"
          className="text-sm font-medium hover:text-blue-600"
        >
          Список
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500 uppercase font-bold">
              {role}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-500 hover:underline"
            >
              Выйти
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold"
          >
            Войти
          </Link>
        )}
      </div>
    </nav>
  );
};
