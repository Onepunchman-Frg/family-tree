"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/utils/supabase";
import { User } from "@supabase/supabase-js";

// Наши три роли
type Role = "guest" | "member" | "admin" | null;

interface AuthContextType {
  user: User | null;
  role: Role;
  loading: boolean; // Идет ли сейчас проверка
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Функция получения данных пользователя и его роли
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      if (session?.user) {
        // Идем в таблицу ролей и узнаем, кто это
        const { data } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .single();

        setRole(data?.role ?? "guest");
      }
      setLoading(false);
    };

    fetchSession();

    // 2. Слушатель: если пользователь нажмет "Выйти" или войдет с другого аккаунта
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          const { data } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id)
            .single();
          setRole(data?.role ?? "guest");
        } else {
          setRole(null);
        }
        setLoading(false);
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Удобный хук для использования в любом месте
export const useAuth = () => useContext(AuthContext);
