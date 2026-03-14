import { Person } from "@/types/person";
import Link from "next/link"; // Импортируем Link для навигации

interface Props {
  person: Person;
}

export const PersonCard = ({ person }: Props) => {
  return (
    <Link href={`/person/${person.id}`}>
      <div className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white cursor-pointer h-full">
        <div className="w-16 h-16 bg-blue-100 rounded-full mb-3 flex items-center justify-center text-xl font-bold text-blue-600">
          {person.firstName[0]}
        </div>
        <h3 className="font-bold text-lg">
          {person.lastName} <br />
          {person.firstName} {person.patronymic}
        </h3>
        <p className="text-sm text-gray-500">{person.birthDate}</p>
      </div>
    </Link>
  );
};
