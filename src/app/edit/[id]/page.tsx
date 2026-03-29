"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { getStoredPeople, updatePerson, uploadPhoto } from "@/utils/storage";
import { Gender, Person } from "@/types/person";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function EditPersonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { user, role, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState<Person | null>(null);
  const [existingPeople, setExistingPeople] = useState<Person[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    if (!authLoading) {
      if (!user || role === "guest") {
        alert("У вас нет прав для редактирования данных.");
        router.push(`/person/${id}`);
      }
    }
  }, [user, role, authLoading, id, router]);

  useEffect(() => {
    const loadData = async () => {
      const people = await getStoredPeople();
      setExistingPeople(people);

      const personToEdit = people.find((p) => p.id === id);
      if (personToEdit) {
        setFormData(personToEdit);
      }
    };

    loadData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setIsSaving(true);
    try {
      // По умолчанию оставляем СТАРУЮ ссылку на фото
      let finalPhotoUrl = formData.photoUrl;

      // Если пользователь выбрал НОВЫЙ файл, загружаем его
      if (photoFile) {
        const uploadedUrl = await uploadPhoto(photoFile);
        if (uploadedUrl) {
          finalPhotoUrl = uploadedUrl; // Заменяем старую ссылку на новую
        }
      }

      // Собираем финальный объект для базы
      const updatedPerson = {
        ...formData,
        photoUrl: finalPhotoUrl,
      };

      await updatePerson(updatedPerson); // Отправляем в базу
      router.push(`/person/${id}`);
    } catch (error: any) {
      console.error("Ошибка обновления:", error);
      alert(`Ошибка при сохранении: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (!formData)
    return <div className="p-8 text-center">Загрузка данных...</div>;

  if (authLoading || !formData)
    return <div className="p-8 text-center">Загрузка...</div>;
  if (role === "guest") return null;

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

        {/* ФОТОГРАФИЯ */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-600">
            Фотография
          </label>
          {formData.photoUrl && !photoFile && (
            <div className="mb-3">
              <p className="text-xs text-gray-500 mb-1">Текущее фото:</p>
              <img
                src={formData.photoUrl}
                alt="Current avatar"
                className="w-16 h-16 rounded-full object-cover border"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
            className="w-full p-2 border rounded outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
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

        {/* ВЫБОР СУПРУГА/СУПРУГИ */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-600">
            Супруг / Супруга
          </label>
          <select
            multiple
            className="w-full p-2 border rounded h-24 outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.spouses}
            onChange={(e) => {
              const values = Array.from(
                e.target.selectedOptions,
                (option) => option.value,
              );
              setFormData({ ...formData, spouses: values });
            }}
          >
            {existingPeople.map((p) => (
              <option key={p.id} value={p.id}>
                {p.lastName} {p.firstName}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-1">
            Зажмите Ctrl/Cmd для выбора (если было несколько браков)
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
            disabled={isSaving}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:bg-blue-300 transition"
          >
            {isSaving ? "Сохранение..." : "Сохранить изменения"}
          </button>
          <Link
            href={`/person/${id}`}
            className="px-6 py-3 border rounded-lg hover:bg-gray-50 transition"
          >
            Отмена
          </Link>
        </div>
      </form>
    </main>
  );
}
