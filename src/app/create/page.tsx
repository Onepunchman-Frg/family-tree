"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// Больше не импортируем generateId!
import { getStoredPeople, addPersonWithRelations } from "@/utils/storage";
import { Gender, Person } from "@/types/person";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function CreatePersonPage() {
  const router = useRouter();
  const { user, role, loading: authLoading } = useAuth();

  const [existingPeople, setExistingPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Индикатор загрузки

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    patronymic: "",
    birthDate: "",
    gender: "male" as Gender,
    description: "",
    parents: [] as string[],
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user || role === "guest") {
        alert(
          "У вас нет прав для создания профилей. Пожалуйста, дождитесь одобрения администратора.",
        );
        router.push("/people");
      }
    }
  }, [user, role, authLoading, router]);

  useEffect(() => {
    // Правильный способ вызвать async-функцию внутри useEffect
    const loadPeople = async () => {
      const people = await getStoredPeople();
      setExistingPeople(people);
    };

    loadPeople();
  }, []);

  // Делаем функцию асинхронной
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Включаем кнопку "Загрузка..."

    try {
      // Формируем объект БЕЗ id (база сама его присвоит)
      const newPerson = {
        ...formData,
        children: [],
        spouses: [],
      };

      // Ждём, пока данные сохранятся в Supabase
      await addPersonWithRelations(newPerson);
      router.push("/people");
    } catch (error) {
      console.error("Ошибка при сохранении:", error);
      alert("Не удалось сохранить данные. Проверьте консоль.");
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading)
    return <div className="p-8 text-center">Проверка прав доступа...</div>;
  if (!user || role === "guest") return null; // Блокируем рендер

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Добавить человека
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 border rounded-xl shadow-sm"
      >
        {/* ФАМИЛИЯ */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-600">
            Фамилия
          </label>
          <input
            required
            className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
          />
        </div>

        {/* ИМЯ И ОТЧЕСТВО */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">
              Имя
            </label>
            <input
              required
              className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">
              Отчество
            </label>
            <input
              className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.patronymic}
              onChange={(e) =>
                setFormData({ ...formData, patronymic: e.target.value })
              }
            />
          </div>
        </div>

        {/* ДАТА И ПОЛ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">
              Дата рождения
            </label>
            <input
              type="date"
              required
              className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.birthDate}
              onChange={(e) =>
                setFormData({ ...formData, birthDate: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-600">
              Пол
            </label>
            <select
              className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value as Gender })
              }
            >
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
            </select>
          </div>
        </div>

        {/* ВЫБОР РОДИТЕЛЕЙ */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-600">
            Родители (макс. 2)
          </label>
          <select
            multiple
            className="w-full p-2 border rounded h-32 outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.parents}
            onChange={(e) => {
              const values = Array.from(
                e.target.selectedOptions,
                (option) => option.value,
              );
              setFormData({ ...formData, parents: values });
            }}
          >
            {existingPeople.map((p) => (
              <option key={p.id} value={p.id}>
                {p.lastName} {p.firstName}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-1">
            Зажмите Ctrl (или Cmd), чтобы выбрать двоих
          </p>
        </div>

        {/* ОПИСАНИЕ */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-600">
            Биография / Описание
          </label>
          <textarea
            className="w-full p-2 border rounded h-32 outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`flex-1 text-white py-3 rounded-lg font-bold transition-all shadow-lg 
              ${isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"}`}
          >
            {isLoading ? "Сохранение..." : "Добавить в древо"}
          </button>
          <Link
            href="/people"
            className="px-6 py-3 border rounded-lg hover:bg-gray-50 transition text-center"
          >
            Отмена
          </Link>
        </div>
      </form>
    </main>
  );
}
