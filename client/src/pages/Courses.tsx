import { useEffect, useState } from "react";
import { http } from "../api/http";
import NavBar from "../components/NavBar";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

type Course = { id:number; code:string; name:string; description?:string };

export default function Courses(){
  const { user } = useAuth();
  const [courses,setCourses]=useState<Course[]>([]);
  useEffect(()=>{ http.get("/courses").then(r=>setCourses(r.data)); },[]);

  return (
    <div>
      <NavBar/>
      <div className="container-page">
        <div className="mb-5">
          <h1 className="text-2x1 font-bold">Kursevi</h1>
          <p className="text-sm text-slate-900 mt-1">
            {user ? "Izaberi kurs i pristupi obaveštenjima i materijalima."
                  : "Prijavi se da pristupiš sadržaju kurseva."}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {courses.map(c => (
            <Link key={c.id} to={`/courses/${c.id}`} className="card p-5 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div>
                  <div className="pill-code">{c.code}</div>
                  <div className="mt-2 text-lg font-semibold">{c.name}</div>
                  <div className="text-sm text-slate-600 mt-1 line-clamp-2">{c.description || "—"}</div>
                </div>
                <span className="text-indigo-500 text-sm">Otvori →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
