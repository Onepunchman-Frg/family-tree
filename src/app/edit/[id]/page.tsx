"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { getStoredPeople, updatePerson } from "@/utils/storage";
import { Gender, Person } from "@/types/person";
import Link from "next/link";

export default function EditPersonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [formData, setFormData] = useState<Person | null>(null);
  const [existingPeople, setExistingPeople] = useState<Person[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const people = await getStoredPeople();
      setExistingPeople(people);

      const personToEdit = people.find((p) => p.id === id);
      if (personToEdit) {
        setFormData(personToEdit);
      } else {
        router.push("/people");
      }
    };

    loadData();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      try {
        await updatePerson(formData); // Ждем обновления в БД
        router.push(`/person/${id}`);
      } catch (error) {
        console.error("Ошибка при обновлении:", error);
        alert("Не удалось обновить.");
      }
    }
  };

  if (!formData)
    return <div className="p-8 text-center">Загрузка данных...</div>;

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Редактировать профиль
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
              value={formData.patronymic || ""}
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
            Родители
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
            {existingPeople
              .filter((p) => p.id !== formData.id) // Нельзя выбрать самого себя родителем
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.lastName} {p.firstName}
                </option>
              ))}
          </select>
          <p className="text-xs text-gray-400 mt-1">
            Удерживайте Ctrl/Cmd для выбора двоих
          </p>
        </div>

        {/* ОПИСАНИЕ */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-600">
            Биография / Описание
          </label>
          <textarea
            className="w-full p-2 border rounded h-32 outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.description || ""}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        {/* КНОПКИ */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
          >
            Сохранить изменения
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border rounded-lg hover:bg-gray-50 transition"
          >
            Отмена
          </button>
        </div>
      </form>
    </main>
  );
}
