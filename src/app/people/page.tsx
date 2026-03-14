"use client";

import { useEffect, useState } from "react";
import { PersonCard } from "@/components/PersonCard";
import { getStoredPeople } from "@/utils/storage";
import { Person } from "@/types/person";
import Link from "next/link";

export default function PeoplePage() {
  const [people, setPeople] = useState<Person[]>([]);

  useEffect(() => {
    setPeople(getStoredPeople());
  }, []);

  return (
    <main className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Все родственники</h1>
        <Link
          href="/create"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Добавить
        </Link>
      </div>

      {people.length === 0 ? (
        <p className="text-gray-500">Список пуст. Добавьте первого человека!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {people.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      )}
    </main>
  );
}
