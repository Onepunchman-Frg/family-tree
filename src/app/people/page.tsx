"use client";

import { useEffect, useState } from "react";
import { PersonCard } from "@/components/PersonCard";
import { getStoredPeople } from "@/utils/storage";
import { Person } from "@/types/person";
import Link from "next/link";

export default function PeoplePage() {
  const [people, setPeople] = useState<Person[]>([]);
  // Состояния для поиска и фильтров
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState<"all" | "male" | "female">(
    "all",
  );

  useEffect(() => {
    // Создаем асинхронную функцию внутри useEffect
    const loadPeople = async () => {
      const data = await getStoredPeople();
      setPeople(data);
    };

    loadPeople(); // Вызываем её
  }, []);

  // ЛОГИКА ФИЛЬТРАЦИИ: Создаем производный массив
  const filteredPeople = people.filter((person) => {
    // 1. Поиск по ФИО (приводим всё к нижнему регистру, чтобы поиск был нечувствителен к регистру)
    const fullName =
      `${person.lastName} ${person.firstName} ${person.patronymic}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());

    // 2. Фильтр по полу
    const matchesGender =
      genderFilter === "all" || person.gender === genderFilter;

    return matchesSearch && matchesGender;
  });

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Все родственники</h1>
        <Link
          href="/create"
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition shadow-md"
        >
          + Добавить человека
        </Link>
      </div>

      {/* ПАНЕЛЬ ИНСТРУМЕНТОВ (Поиск и Фильтр) */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-white p-4 rounded-xl border shadow-sm">
        <div className="flex-1">
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">
            Поиск по имени
          </label>
          <input
            type="text"
            placeholder="Введите фамилию или имя..."
            className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="sm:w-48">
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">
            Пол
          </label>
          <select
            className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value as any)}
          >
            <option value="all">Все</option>
            <option value="male">Мужчины</option>
            <option value="female">Женщины</option>
          </select>
        </div>
      </div>

      {/* ВЫВОД РЕЗУЛЬТАТОВ */}
      {filteredPeople.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed">
          <p className="text-gray-500">Никого не нашли по вашему запросу 🔍</p>
          <button
            onClick={() => {
              setSearchTerm("");
              setGenderFilter("all");
            }}
            className="text-blue-600 underline mt-2"
          >
            Сбросить фильтры
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredPeople.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      )}
    </main>
  );
}
