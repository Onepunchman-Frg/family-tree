"use client";

import { useEffect, useState } from "react";
import { getStoredPeople } from "@/utils/storage";
import { Person } from "@/types/person";
import Link from "next/link";

export default function TreePage() {
  const [people, setPeople] = useState<Person[]>([]);
  const [generations, setGenerations] = useState<Record<number, Person[]>>({});

  useEffect(() => {
    const allPeople = getStoredPeople();
    setPeople(allPeople);

    // Алгоритм распределения по поколениям
    const genMap: Record<number, Person[]> = {};

    // Помогательная функция для определения уровня человека
    const getLevel = (person: Person, currentLevel: number = 0): number => {
      // Если у человека нет родителей в базе, он на текущем уровне
      if (!person.parents || person.parents.length === 0) {
        return currentLevel;
      }

      // Иначе его уровень — это уровень его самого "высокого" родителя + 1
      // Это упрощенная логика, чтобы не уйти в бесконечный цикл
      return currentLevel + 1;
    };

    allPeople.forEach((p) => {
      // Для MVP: если нет родителей — уровень 0, если есть — уровень 1
      // В будущем мы сделаем рекурсию для глубоких деревьев
      const level = p.parents.length === 0 ? 0 : 1;

      if (!genMap[level]) genMap[level] = [];
      genMap[level].push(p);
    });

    setGenerations(genMap);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800">Семейное древо</h1>
          <Link href="/people" className="text-blue-600 hover:underline">
            К списку людей
          </Link>
        </div>

        {Object.keys(generations).length === 0 ? (
          <div className="text-center p-20 border-2 border-dashed rounded-3xl">
            <p className="text-gray-500">
              Дерево пока пусто. Добавьте родственников!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-16 items-center">
            {Object.keys(generations)
              .sort()
              .map((level) => (
                <div key={level} className="w-full">
                  <h2 className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">
                    Поколение {Number(level) + 1}
                  </h2>
                  <div className="flex flex-wrap justify-center gap-6">
                    {generations[Number(level)].map((person) => (
                      <Link
                        key={person.id}
                        href={`/person/${person.id}`}
                        className="group relative"
                      >
                        <div className="bg-white border-2 border-white shadow-md rounded-xl p-4 w-48 text-center group-hover:border-blue-500 transition-all">
                          <div className="w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3 flex items-center justify-center text-blue-600 font-bold">
                            {person.firstName[0]}
                          </div>
                          <p className="font-bold text-gray-800 truncate">
                            {person.firstName} {person.lastName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {person.birthDate.split("-")[0]}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  {/* Визуальный разделитель (линия) между поколениями */}
                  {Number(level) < Object.keys(generations).length - 1 && (
                    <div className="w-px h-16 bg-gray-300 mx-auto mt-8"></div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>
    </main>
  );
}
