"use client";

import { useEffect, useState, ReactElement, use } from "react";
import { useRouter } from "next/navigation";
import { getStoredPeople, deletePerson } from "@/utils/storage";
import { Person } from "@/types/person";
import Link from "next/link";
import { notFound } from "next/navigation";

export default function PersonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params); // В клиенте используем use() для развертки промиса
  const router = useRouter(); // Добавляем роутер для редиректа
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await getStoredPeople();
      setPeople(data);
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) return <div className="p-8">Загрузка...</div>;

  const person = people.find((p) => p.id === id);
  if (!person) return notFound();

  const getPerson = (pid: string) => people.find((p) => p.id === pid);

  const handleDelete = async () => {
    if (
      window.confirm(
        "Вы уверены, что хотите удалить этого человека и все связи с ним?",
      )
    ) {
      try {
        await deletePerson(id); // Ждем удаления из БД
        router.push("/people");
      } catch (error) {
        console.error("Ошибка при удалении:", error);
        alert("Не удалось удалить.");
      }
    }
  };
  return (
    <main className="max-w-4xl mx-auto p-8">
      <Link href="/people" className="text-blue-500 mb-6 inline-block">
        ← К списку
      </Link>

      <div className="bg-white border rounded-2xl p-8 shadow-sm">
        <div className="w-48 h-48 flex-shrink-0 bg-gray-100 rounded-2xl overflow-hidden border-4 border-white shadow-lg flex items-center justify-center text-6xl">
          {person.photoUrl ? (
            <img
              src={person.photoUrl}
              alt="Аватар"
              className="w-full h-full object-cover"
            />
          ) : person.gender === "male" ? (
            "👨"
          ) : (
            "👩"
          )}
        </div>

        {/* ДАННЫЕ ПРОФИЛЯ */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl font-bold">
              {person.lastName} {person.firstName} {person.patronymic}
            </h1>
            {/* Тут твои кнопки редактировать/удалить */}
          </div>

          <div className="text-gray-600 mb-6">
            <p>
              <strong>Дата рождения:</strong>{" "}
              {new Date(person.birthDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Пол:</strong>{" "}
              {person.gender === "male" ? "Мужской" : "Женский"}
            </p>
          </div>

          {person.description && (
            <div className="bg-blue-50 p-4 rounded-xl text-blue-900">
              <strong>Биография:</strong> <br />
              {person.description}
            </div>
          )}
        </div>

        <Link
          href={`/edit/${person.id}`}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition"
        >
          ⚙️ Редактировать
        </Link>

        <button
          onClick={handleDelete}
          className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-semibold transition border border-red-100"
        >
          🗑️ Удалить
        </button>

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

            {/* БЛОК СУПРУГОВ */}
            {person.spouses && person.spouses.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4 border-b pb-2">
                  Супруги
                </h2>
                <div className="flex gap-4 flex-wrap">
                  {person.spouses.map((spouseId) => {
                    const spouse = people.find((p) => p.id === spouseId);
                    if (!spouse) return null;
                    return (
                      <Link
                        key={spouse.id}
                        href={`/person/${spouse.id}`}
                        className="bg-pink-50 text-pink-700 px-4 py-2 rounded-lg hover:bg-pink-100 transition shadow-sm"
                      >
                        💍 {spouse.firstName} {spouse.lastName}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
