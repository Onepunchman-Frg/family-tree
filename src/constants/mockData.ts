import { Person } from "@/types/person";

export const MOCK_PEOPLE: Person[] = [
  {
    id: "1",
    firstName: "Иван",
    lastName: "Иванов",
    gender: "male",
    birthDate: "1985-05-20",
    description: "Основатель династии, увлекается рыбалкой.",
    parents: [],
    children: ["2"],
    spouses: [],
  },
  {
    id: "2",
    firstName: "Анна",
    lastName: "Иванова",
    gender: "female",
    birthDate: "2010-11-15",
    description: "Учится в школе, любит программирование.",
    parents: ["1"],
    children: [],
    spouses: [],
  },
];
