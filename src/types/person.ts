export type Gender = "male" | "female" | "other";

export interface Person {
  id: string;
  firstName: string;
  lastName: string;
  patronymic?: string;
  birthDate: string;
  gender: Gender;
  description?: string;
  // Пока оставим связи простыми массивами ID
  parents: string[];
  children: string[];
  spouses: string[];
  photoUrl?: string; // НОВОЕ ПОЛЕ
}
