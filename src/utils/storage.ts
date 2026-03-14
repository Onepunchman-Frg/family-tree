import { Person } from "@/types/person";

const STORAGE_KEY = "family_tree_data";

export const generateId = (): string => {
  if (typeof window !== "undefined" && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  // Запасной вариант (fallback) для старых браузеров или небезопасных соединений
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

export const getStoredPeople = (): Person[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const savePerson = (person: Person) => {
  const people = getStoredPeople();
  people.push(person);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(people));
};
