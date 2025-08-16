import { useEffect, useState } from "react";
import { http } from "../api/http";
import { useNavigate } from "react-router-dom";

type Course = { id:number; name:string; code:string };
export default function Register(){
  const nav = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [name,setName]=useState("");
  const [role,setRole]=useState<"STUDENT"|"PROFESSOR">("STUDENT");
  const [selected, setSelected] = useState<number[]>([]);
  const [err,setErr]=useState("");

  useEffect(()=>{ http.get("/courses").then(r=>setCourses(r.data)); },[]);
  const toggle = (id:number)=> setSelected(s=> s.includes(id) ? s.filter(x=>x!==id) : (s.length<3 ? [...s,id] : s) );

  const onSubmit = async (e:React.FormEvent)=>{
    e.preventDefault(); setErr("");
    try{ await http.post("/auth/register", { email,password,name,role, courseIds:selected }); nav("/login"); }
    catch(e:any){ setErr(e?.response?.data?.message||"Greška"); }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-lg mx-auto p-6 mt-12 bg-white rounded-2xl shadow">
        <h1 className="text-2xl font-semibold mb-4">Registracija</h1>
        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <input className="border p-2 rounded" placeholder="Ime i prezime" value={name} onChange={e=>setName(e.target.value)} />
          <input className="border p-2 rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="border p-2 rounded" placeholder="Lozinka" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
          <div className="flex gap-4 items-center">
            <label className="flex items-center gap-2"><input type="radio" checked={role==='STUDENT'} onChange={()=>setRole('STUDENT')} /> Student</label>
            <label className="flex items-center gap-2"><input type="radio" checked={role==='PROFESSOR'} onChange={()=>setRole('PROFESSOR')} /> Profesor</label>
          </div>
          <div>
            <div className="font-medium mb-1">Izaberi do 3 kursa</div>
            <div className="grid grid-cols-2 gap-2">
              {courses.map(c=> (
                <label key={c.id} className={`border rounded p-2 cursor-pointer ${selected.includes(c.id)?'bg-blue-50 border-blue-400':''}`}>
                  <input type="checkbox" className="mr-2" checked={selected.includes(c.id)} onChange={()=>toggle(c.id)} /> {c.code} — {c.name}
                </label>
              ))}
            </div>
          </div>
          {err && <div className="text-red-600 text-sm">{err}</div>}
          <button className="bg-blue-600 text-white rounded p-2">Kreiraj nalog</button>
        </form>
      </div>
    </div>
  );
}
