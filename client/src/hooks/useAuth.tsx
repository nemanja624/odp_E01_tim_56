import React from "react";
import { api } from "../api";

export type User = {
  id: number;
  name: string;
  email: string;
  role: "PROFESSOR" | "STUDENT";
  courses: { id: number; title: string; code: string }[];
};

type AuthCtx = {
  user: User | null;
  setUser: (u: User | null) => void;
  loading: boolean;
  refresh: () => Promise<void>;
};

const Ctx = React.createContext<AuthCtx>({
  user: null,
  setUser: () => {},
  loading: true,
  refresh: async () => {},
});

export const useAuth = () => React.useContext(Ctx);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  const refresh = React.useCallback(async () => {
    try {
      const r = await api.get("/auth/me");
      setUser(r.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <Ctx.Provider value={{ user, setUser, loading, refresh }}>
      {children}
    </Ctx.Provider>
  );
};
