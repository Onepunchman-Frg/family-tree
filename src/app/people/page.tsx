import { MOCK_PEOPLE } from "@/constants/mockData";
import { PersonCard } from "@/components/PersonCard";

export default function PeoplePage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-8">Все родственники</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {MOCK_PEOPLE.map((person) => (
          <PersonCard key={person.id} person={person} />
        ))}
      </div>
    </main>
  );
}
