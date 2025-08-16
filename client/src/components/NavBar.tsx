import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { http } from "../api/http";

export default function NavBar(){
  const { user, setUser } = useAuth();
  const nav = useNavigate();
  return (
    <div className="w-full bg-gray-900 text-white p-3 flex items-center justify-between">
      <Link to="/" className="font-semibold">KursHub</Link>
      <div className="flex items-center gap-4">
        {user && <span className="text-sm opacity-80">{user.name} ({user.role})</span>}
        {user ? (
          <button className="px-3 py-1 bg-gray-700 rounded" onClick={async()=>{await http.post("/auth/logout"); setUser(null); nav("/login");}}>Odjava</button>
        ): (
          <>
            <Link to="/login" className="px-3 py-1 bg-blue-600 rounded">Prijava</Link>
            <Link to="/register" className="px-3 py-1 bg-gray-700 rounded">Registracija</Link>
          </>
        )}
      </div>
    </div>
  );
}
