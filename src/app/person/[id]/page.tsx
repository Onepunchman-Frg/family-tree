"use client";

import { useEffect, useState, ReactElement, use } from "react";
import { getStoredPeople } from "@/utils/storage";
import { Person } from "@/types/person";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function PersonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params); // В клиенте используем use() для развертки промиса
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPeople(getStoredPeople());
    setLoading(false);
  }, []);

  if (loading) return <div className="p-8">Загрузка...</div>;

  const person = people.find((p) => p.id === id);
  if (!person) return notFound();

  const getPerson = (pid: string) => people.find((p) => p.id === pid);

  return (
    <main className="max-w-4xl mx-auto p-8">
      <Link href="/people" className="text-blue-500 mb-6 inline-block">
        ← К списку
      </Link>

      <div className="bg-white border rounded-2xl p-8 shadow-sm">
        <h1 className="text-4xl font-bold mb-4">
          {person.firstName} {person.lastName} {person.patronymic}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <section>
            <h2 className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-4">
              Родственные связи
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Родители:</p>
                {person.parents.length > 0 ? (
                  person.parents.map((pid) => (
                    <Link
                      key={pid}
                      href={`/person/${pid}`}
                      className="block text-blue-600"
                    >
                      {getPerson(pid)?.firstName} {getPerson(pid)?.lastName}
                    </Link>
                  ))
                ) : (
                  <p>Не указаны</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">Дети:</p>
                {person.children.length > 0 ? (
                  person.children.map((pid) => (
                    <Link
                      key={pid}
                      href={`/person/${pid}`}
                      className="block text-blue-600"
                    >
                      {getPerson(pid)?.firstName} {getPerson(pid)?.lastName}
                    </Link>
                  ))
                ) : (
                  <p>Нет детей</p>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
