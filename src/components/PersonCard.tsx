import { Person } from "@/types/person";

interface Props {
  person: Person;
}

export const PersonCard = ({ person }: Props) => {
  return (
    <div className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="w-16 h-16 bg-gray-200 rounded-full mb-3 flex items-center justify-center text-xl font-bold text-gray-500">
        {person.firstName[0]}
      </div>
      <h3 className="font-bold text-lg">
        {person.firstName} {person.lastName}
      </h3>
      <p className="text-sm text-gray-500">{person.birthDate}</p>
      <p className="mt-2 text-sm line-clamp-2">{person.description}</p>
    </div>
  );
};
