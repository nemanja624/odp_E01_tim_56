import { useState } from "react";
import { http } from "../api/http";
import { useAuth } from "../auth/useAuth";
import { Link, useNavigate } from "react-router-dom";

export default function Login(){
  const nav = useNavigate();
  const { setUser } = useAuth();
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [err,setErr]=useState("");

  const onSubmit = async (e:React.FormEvent)=>{
    e.preventDefault(); setErr("");
    try{ const r = await http.post("/auth/login", { email,password }); setUser(r.data.user); nav("/"); }
    catch(e:any){ setErr(e?.response?.data?.message||"Greška"); }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-md mx-auto p-6 mt-16 bg-white rounded-2xl shadow">
        <h1 className="text-2xl font-semibold mb-4">Prijava</h1>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <input className="border p-2 rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="border p-2 rounded" placeholder="Lozinka" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          {err && <div className="text-red-600 text-sm">{err}</div>}
          <button className="bg-blue-600 text-white rounded p-2">Uloguj se</button>
        </form>
        <div className="text-sm mt-3">Nemaš nalog? <Link to="/register" className="text-blue-600">Registruj se</Link></div>
      </div>
    </div>
  );
}
