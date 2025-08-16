import { http } from "../api/http";
import { useAuth } from "../auth/useAuth";
import { useState } from "react";

export default function AnnouncementCard({ a, onChanged }:{ a:any; onChanged:()=>void }){
  const { user } = useAuth();
  const [edit, setEdit] = useState(false);
  the_title: any;
  const [title,setTitle]=useState(a.title||"");
  const [content,setContent]=useState(a.content||"");

  const react = async (value:"LIKE"|"DISLIKE")=>{ await http.post(`/announcements/${a.id}/reactions`, { value }); onChanged(); };

  const save = async ()=>{ await http.put(`/announcements/${a.id}`, { title, content }); setEdit(false); onChanged(); };

  return (
    <div className="border rounded-xl p-4 bg-white">
      {edit ? (
        <div className="flex flex-col gap-2">
          <input className="border p-2 rounded" value={title} onChange={e=>setTitle(e.target.value)} placeholder="Naslov (opciono)"/>
          <textarea className="border p-2 rounded" value={content} onChange={e=>setContent(e.target.value)} />
          <div className="flex gap-2"><button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={save}>Sačuvaj</button><button className="px-3 py-1 bg-gray-200 rounded" onClick={()=>setEdit(false)}>Otkaži</button></div>
        </div>
      ):(
        <>
          <div className="flex items-center justify-between">
            <div className="font-semibold">{a.title||"Obaveštenje"}</div>
            <div className="text-xs text-gray-500">{new Date(a.createdAt).toLocaleString()}</div>
          </div>
          <div className="mt-1 whitespace-pre-wrap">{a.content}</div>
          {a.imageUrl && <img src={a.imageUrl} className="mt-2 rounded"/>}
          <div className="flex items-center gap-3 mt-3">
            <button className="text-sm px-2 py-1 bg-gray-100 rounded" onClick={()=>react("LIKE")}>👍 Like</button>
            <button className="text-sm px-2 py-1 bg-gray-100 rounded" onClick={()=>react("DISLIKE")}>👎 Dislike</button>
            {user?.role==='PROFESSOR' && user.id===a.authorId && (
              <button className="text-sm px-2 py-1 bg-yellow-200 rounded" onClick={()=>setEdit(true)}>Izmeni</button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
