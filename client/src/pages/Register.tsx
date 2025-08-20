import React from 'react';
import { api } from '../api';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import CourseSelector from '../components/CourseSelector';

export default function Register(){
  const [name,setName] = React.useState('');
  const [email,setEmail] = React.useState('');
  const [password,setPassword] = React.useState('');
  const [role,setRole] = React.useState<'PROFESSOR'|'STUDENT'>('STUDENT');
  const [courseIds,setCourseIds] = React.useState<number[]>([]);
  const [err,setErr] = React.useState('');
  const { setUser } = useAuth();
  const nav = useNavigate();
  async function onSubmit(e:React.FormEvent){
    e.preventDefault();
    setErr('');
    try{
      const r = await api.post('/auth/register',{ name,email,password,role,courseIds });
      setUser(r.data.user);
      nav('/');
    }catch(e:any){ setErr(e?.response?.data?.message || 'Greška'); }
  }
  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Registracija</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="border w-full rounded px-3 py-2" placeholder="Ime i prezime" value={name} onChange={e=>setName(e.target.value)} />
        <input className="border w-full rounded px-3 py-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="border w-full rounded px-3 py-2" placeholder="Lozinka" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <div className="flex gap-4">
          <label className="flex items-center gap-2"><input type="radio" checked={role==='STUDENT'} onChange={()=>setRole('STUDENT')}/> Student</label>
          <label className="flex items-center gap-2"><input type="radio" checked={role==='PROFESSOR'} onChange={()=>setRole('PROFESSOR')}/> Profesor</label>
        </div>
        <div>
          <div className="text-sm font-medium mb-1">Kursevi</div>
          <CourseSelector value={courseIds} onChange={setCourseIds}/>
        </div>
        {err && <div className="text-red-600 text-sm">{err}</div>}
        <button className="px-3 py-2 rounded bg-slate-900 text-white">Kreiraj nalog</button>
      </form>
    </div>
  );
}
