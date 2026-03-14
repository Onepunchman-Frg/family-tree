import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* HERO SECTION */}
      <section className="relative py-20 px-8 flex flex-col items-center text-center bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-gray-900">
            История вашей семьи в{" "}
            <span className="text-blue-600">одном месте</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Создавайте визуальное генеалогическое древо, храните данные о
            близких и передавайте историю поколений в удобном цифровом формате.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/tree"
              className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200"
            >
              Открыть дерево
            </Link>
            <Link
              href="/people"
              className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-full font-bold text-lg hover:bg-gray-50 transition"
            >
              Список людей
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20 px-8 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">
          Что умеет приложение?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <FeatureCard
            icon="🌿"
            title="Визуальное дерево"
            text="Автоматическое построение связей между поколениями в интерактивном виде."
          />
          <FeatureCard
            icon="📝"
            title="Управление данными"
            text="Добавляйте, редактируйте и удаляйте профили родственников с подробным описанием."
          />
          <FeatureCard
            icon="🔍"
            title="Быстрый поиск"
            text="Мгновенно находите нужных людей по фамилии или фильтруйте по полу."
          />
        </div>
      </section>

      {/* TECH STACK SECTION */}
      <section className="py-20 px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-4">
            Стек технологий
          </h2>
          <div className="flex flex-wrap justify-center gap-8 text-2xl font-bold text-gray-400">
            <span className="hover:text-black transition cursor-default">
              Next.js 15
            </span>
            <span className="hover:text-blue-500 transition cursor-default">
              React
            </span>
            <span className="hover:text-blue-400 transition cursor-default">
              TypeScript
            </span>
            <span className="hover:text-teal-500 transition cursor-default">
              Tailwind CSS
            </span>
            <span className="hover:text-orange-500 transition cursor-default">
              LocalStorage
            </span>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center border-t text-gray-400 text-sm">
        <p>© 2026 Семейное Древо. Сделано с ❤️ для портфолио.</p>
      </footer>
    </div>
  );
}

// Маленький вспомогательный компонент для карточек
function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-gray-100 hover:shadow-xl transition-shadow bg-white">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-500">{text}</p>
    </div>
  );
}
