"use client";

import { Person } from "@/types/person";
import Link from "next/link"; // Импортируем Link для навигации
import { useAuth } from "@/context/AuthContext";

interface Props {
  person: Person;
}

export const PersonCard = ({ person }: Props) => {
  const { role } = useAuth();
  const isGuest = role === "guest" || !role;

  return (
    <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl overflow-hidden shrink-0 shadow-sm border-2 border-white ${person.gender === "male" ? "bg-blue-50" : "bg-pink-50"}`}
        >
          {person.photoUrl ? (
            <img
              src={person.photoUrl}
              alt={`${person.firstName} ${person.lastName}`}
              className="w-full h-full object-cover"
            />
          ) : person.gender === "male" ? (
            "👨"
          ) : (
            "👩"
          )}
        </div>
        <div>
          <h3 className="font-bold text-gray-900 leading-tight">
            {person.lastName} <br /> {person.firstName}
          </h3>
        </div>
      </div>

      {/* Если НЕ гость — показываем дату и кнопку перехода */}
      {!isGuest ? (
        <>
          <p className="text-xs text-gray-400 mb-4 italic">
            📅 {new Date(person.birthDate).toLocaleDateString()}
          </p>
          <Link
            href={`/person/${person.id}`}
            className="block text-center bg-gray-50 text-blue-600 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 hover:text-white transition"
          >
            Смотреть профиль
          </Link>
        </>
      ) : (
        <p className="text-[10px] text-gray-300 uppercase tracking-widest font-bold">
          Доступ ограничен
        </p>
      )}
    </div>
  );
};
