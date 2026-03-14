import { supabase } from "./supabase";
import { Person } from "@/types/person";

// 1. Получить всех людей
export const getStoredPeople = async (): Promise<Person[]> => {
  const { data, error } = await supabase
    .from("people")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Ошибка при загрузке:", error);
    return [];
  }

  return data as Person[];
};

// 2. Добавить человека
// Используем Omit, чтобы сказать TypeScript: "мы передаем всё, кроме id, его сделает база"
export const addPersonWithRelations = async (newPerson: Omit<Person, "id">) => {
  const { data, error } = await supabase
    .from("people")
    .insert([newPerson])
    .select();

  if (error) throw error;

  return data[0];
};

// 3. Обновить человека
export const updatePerson = async (updatedPerson: Person) => {
  const { error } = await supabase
    .from("people")
    .update(updatedPerson)
    .eq("id", updatedPerson.id);

  if (error) throw error;
};

// 4. Удалить человека
export const deletePerson = async (id: string) => {
  const { error } = await supabase.from("people").delete().eq("id", id);

  if (error) throw error;
};
