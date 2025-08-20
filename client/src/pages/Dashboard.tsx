import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
export default function Dashboard(){
  const { user } = useAuth();
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Kursevi</h1>
      <div className="grid md:grid-cols-2 gap-3">
        {user?.courses?.map(c=>(
          <Link key={c.id} to={`/course/${c.id}`} className="bg-white rounded-xl shadow p-4 hover:shadow-md transition">
            <div className="font-semibold">{c.title}</div>
            <div className="text-slate-500 text-sm">{c.code}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
