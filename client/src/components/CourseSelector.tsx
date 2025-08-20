import React from 'react';
import { api } from '../api';
type Course = { id:number; title:string; code:string };
export default function CourseSelector({ value, onChange }:{value:number[],onChange:(v:number[])=>void}){
  const [courses, setCourses] = React.useState<Course[]>([]);
  React.useEffect(()=>{ api.get('/courses').then(r=>setCourses(r.data.courses)); },[]);
  function toggle(id:number){
    const exists = value.includes(id);
    let next = exists ? value.filter(v=>v!==id) : [...value, id];
    if (next.length>3) next = next.slice(0,3);
    onChange(next);
  }
  return (
    <div className="grid grid-cols-2 gap-2">
      {courses.map(c=>(
        <label key={c.id} className={`border rounded p-2 cursor-pointer ${value.includes(c.id)?'bg-slate-100 border-slate-600':'border-slate-300'}`}>
          <input type="checkbox" checked={value.includes(c.id)} onChange={()=>toggle(c.id)} className="mr-2"/>
          {c.title} <span className="text-xs text-slate-500">({c.code})</span>
        </label>
      ))}
      <p className="col-span-2 text-xs text-slate-500">Možeš izabrati do 3 kursa.</p>
    </div>
  );
}
