"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { savePerson, generateId } from "@/utils/storage";
import { Gender, Person } from "@/types/person";
import Link from "next/link";

export default function CreatePersonPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    gender: "male" as Gender,
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newPerson: Person = {
      ...formData,
      id: generateId(), // Генерирует уникальный ID типа "123e4567-e89b..."
      parents: [],
      children: [],
      spouses: [],
    };

    savePerson(newPerson);
    router.push("/people"); // Перенаправляем на список после создания
  };

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Добавить родственника</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 border rounded-xl shadow-sm"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Имя</label>
          <input
            required
            className="w-full p-2 border rounded"
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Фамилия</label>
          <input
            required
            className="w-full p-2 border rounded"
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Дата рождения
            </label>
            <input
              type="date"
              required
              className="w-full p-2 border rounded"
              onChange={(e) =>
                setFormData({ ...formData, birthDate: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Пол</label>
            <select
              className="w-full p-2 border rounded"
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value as Gender })
              }
            >
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Описание</label>
          <textarea
            className="w-full p-2 border rounded h-24"
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Сохранить
          </button>
          <Link
            href="/people"
            className="px-6 py-2 border rounded hover:bg-gray-50"
          >
            Отмена
          </Link>
        </div>
      </form>
    </main>
  );
}
