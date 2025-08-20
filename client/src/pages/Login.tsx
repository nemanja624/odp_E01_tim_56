import React from 'react';
import { api } from '../api';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [err, setErr] = React.useState('');
  const { setUser } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    try {
      const r = await api.post('/auth/login', { email, password });
      setUser(r.data.user);
      nav(from, { replace: true });
    } catch (e: any) {
      setErr(e?.response?.data?.message || 'Greška');
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Prijava</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="border w-full rounded px-3 py-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="border w-full rounded px-3 py-2" placeholder="Lozinka" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        {err && <div className="text-red-600 text-sm">{err}</div>}
        <button className="px-3 py-2 rounded bg-slate-900 text-white">Uloguj se</button>
      </form>
      <p className="text-sm mt-3">
        Nemaš nalog? <Link to="/register" className="underline">Registracija</Link>
      </p>
    </div>
  );
}
