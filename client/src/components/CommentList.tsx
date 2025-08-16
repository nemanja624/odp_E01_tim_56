import { useEffect, useState } from "react";
import { http } from "../api/http";
import { useAuth } from "../auth/useAuth";

export default function CommentList({ announcementId }:{ announcementId:number }){
  const { user } = useAuth();
  const [items,setItems]=useState<any[]>([]);
  const [text,setText]=useState("");
  const [editId,setEditId]=useState<number|null>(null);

  const load = async ()=>{ const r = await http.get(`/announcements/${announcementId}/comments`); setItems(r.data); };
  useEffect(()=>{ load(); },[announcementId]);

  const add = async ()=>{ if(!text.trim()) return; await http.post(`/announcements/${announcementId}/comments`, { content:text }); setText(""); load(); };
  const save = async (id:number, content:string)=>{ await http.put(`/announcements/${announcementId}/comments/${id}`, { content }); setEditId(null); load(); };
  const del = async (id:number)=>{ await http.delete(`/announcements/${announcementId}/comments/${id}`); load(); };

  return (
    <div className="mt-3">
      <div className="text-sm font-semibold mb-1">Komentari</div>
      <div className="flex gap-2 mb-2">
        <input className="border p-2 rounded w-full" placeholder="Napiši komentar" value={text} onChange={e=>setText(e.target.value)} />
        <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={add}>Dodaj</button>
      </div>
      <div className="flex flex-col gap-2">
        {items.map(c=> (
          <div key={c.id} className="bg-gray-50 border rounded p-2">
            <div className="text-xs text-gray-600">{c.user.name} • {new Date(c.createdAt).toLocaleString()}</div>
            {editId===c.id ? (
              <div className="flex gap-2 mt-1">
                <input className="border p-1 rounded w-full" defaultValue={c.content} onChange={e=>c.content=e.target.value} />
                <button className="px-2 bg-blue-600 text-white rounded" onClick={()=>save(c.id, c.content)}>Sačuvaj</button>
              </div>
            ):(
              <div className="mt-1 whitespace-pre-wrap">{c.content}</div>
            )}
            {user?.id===c.userId && (
              <div className="flex gap-2 mt-1">
                <button className="text-xs px-2 py-0.5 bg-yellow-200 rounded" onClick={()=>setEditId(c.id)}>Izmeni</button>
                <button className="text-xs px-2 py-0.5 bg-red-200 rounded" onClick={()=>del(c.id)}>Obriši</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
