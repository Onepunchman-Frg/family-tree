import { Person } from "@/types/person";

const STORAGE_KEY = "family_tree_data";

export const generateId = (): string => {
  if (typeof window !== "undefined" && window.crypto?.randomUUID)
    return window.crypto.randomUUID();
  return Math.random().toString(36).substring(2, 15);
};

export const getStoredPeople = (): Person[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const savePeopleAction = (people: Person[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(people));
};

// Функция для добавления человека с автоматическим обновлением связей
export const addPersonWithRelations = (newPerson: Person) => {
  const allPeople = getStoredPeople();

  // 1. Добавляем самого человека
  allPeople.push(newPerson);

  // 2. Обновляем родителей: добавляем им нового ребенка
  newPerson.parents.forEach((parentId) => {
    const parent = allPeople.find((p) => p.id === parentId);
    if (parent && !parent.children.includes(newPerson.id)) {
      parent.children.push(newPerson.id);
    }
  });

  // 3. Обновляем супругов: добавляем им связь
  newPerson.spouses.forEach((spouseId) => {
    const spouse = allPeople.find((p) => p.id === spouseId);
    if (spouse && !spouse.spouses.includes(newPerson.id)) {
      spouse.spouses.push(newPerson.id);
    }
  });

  savePeopleAction(allPeople);
};
