import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../api';
export default function NavBar(){
  const { user, setUser } = useAuth();
  const nav = useNavigate();
  async function logout(){
    await api.post('/auth/logout');
    setUser(null);
    nav('/login');
  }
  return (
    <div className="bg-white shadow px-4 py-3 flex items-center justify-between">
      <Link to="/" className="font-semibold">Smart E-learning</Link>
      <div className="flex items-center gap-4">
        {user && <span className="text-sm text-slate-600">{user.name} ({user.role})</span>}
        {user && <button onClick={logout} className="px-3 py-1 rounded bg-slate-900 text-white">Logout</button>}
      </div>
    </div>
  );
}
