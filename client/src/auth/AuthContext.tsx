import { createContext, useEffect, useState } from "react";
import { http } from "../api/http";

type User = { id:number; email:string; name:string; role:"STUDENT"|"PROFESSOR" } | null;
export const AuthCtx = createContext<{ user: User; setUser: (u:User)=>void }>({ user:null, setUser:()=>{} });

export function AuthProvider({ children }: { children: React.ReactNode }){
  const [user, setUser] = useState<User>(null);
  useEffect(()=>{ http.get("/auth/me").then(r=>setUser(r.data.user)).catch(()=>{}); },[]);
  return <AuthCtx.Provider value={{ user, setUser }}>{children}</AuthCtx.Provider>;
}
