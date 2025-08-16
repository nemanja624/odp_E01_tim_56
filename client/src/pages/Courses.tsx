import { useEffect, useState } from "react";
import { http } from "../api/http";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

export default function Courses(){
  const { user } = useAuth();
  const [courses,setCourses]=useState<any[]>([]);
  useEffect(()=>{ http.get("/courses").then(r=>setCourses(r.data)); },[]);
  return (
    <div>
      <NavBar/>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-3">Kursevi</h1>
        <p className="text-sm text-gray-600 mb-4">{user?"Klikni kurs da uđeš u materijale i obaveštenja.":"Prijavi se da pristupiš."}</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {courses.map(c => (
            <div key={c.id} className="border rounded-xl p-4 bg-white">
              <div className="font-semibold">{c.code} — {c.name}</div>
              <div className="text-sm text-gray-600">{c.description||""}</div>
              <div className="mt-3"><Link to={`/courses/${c.id}`} className="text-blue-600">Otvori</Link></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
