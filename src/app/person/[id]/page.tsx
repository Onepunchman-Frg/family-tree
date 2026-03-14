import { MOCK_PEOPLE } from "@/constants/mockData";
import Link from "next/link";
import { notFound } from "next/navigation";

// Функция-помощник остается прежней
const getPersonById = (id: string) => MOCK_PEOPLE.find((p) => p.id === id);

// 1. Добавляем async перед функцией
export default async function PersonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 2. Ожидаем (await), пока придут параметры
  const { id } = await params;

  const person = getPersonById(id);

  if (!person) {
    notFound();
  }

  // Получаем полные данные родственников
  const parents = person.parents.map(getPersonById).filter(Boolean);
  const children = person.children.map(getPersonById).filter(Boolean);

  return (
    <main className="max-w-4xl mx-auto p-8">
      <Link
        href="/people"
        className="text-blue-500 hover:underline mb-6 inline-block"
      >
        ← Назад к списку
      </Link>

      <div className="bg-white border rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center text-4xl font-bold text-blue-600">
            {person.firstName[0]}
          </div>
          <div>
            <h1 className="text-4xl font-bold">
              {person.firstName} {person.lastName}
            </h1>
            <p className="text-gray-500 italic">
              Дата рождения: {person.birthDate}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">
              Биография
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {person.description || "Информация не заполнена"}
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">
              Семья
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Родители
                </h3>
                <div className="flex flex-col gap-1">
                  {parents.length > 0 ? (
                    parents.map((p) => (
                      <Link
                        key={p?.id}
                        href={`/person/${p?.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {p?.firstName} {p?.lastName}
                      </Link>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400">Нет данных</span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Дети
                </h3>
                <div className="flex flex-col gap-1">
                  {children.length > 0 ? (
                    children.map((p) => (
                      <Link
                        key={p?.id}
                        href={`/person/${p?.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {p?.firstName} {p?.lastName}
                      </Link>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400">Нет данных</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
