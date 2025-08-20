import React from 'react';
import { api } from '../api';
import { useAuth } from '../hooks/useAuth';
export default function CommentList({ announcementId }:{ announcementId:number }){
  const { user } = useAuth();
  const [comments, setComments] = React.useState<any[]>([]);
  const [text, setText] = React.useState('');
  async function fetchAll(){ const r = await api.get(`/comments/announcement/${announcementId}`); setComments(r.data.comments); }
  React.useEffect(()=>{ fetchAll(); },[announcementId]);
  async function add(){
    if (!text.trim()) return;
    await api.post(`/comments/announcement/${announcementId}`, { body: text });
    setText(''); fetchAll();
  }
  async function del(id:number){
    await api.delete(`/comments/${id}`); fetchAll();
  }
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input value={text} onChange={e=>setText(e.target.value)} className="border flex-1 rounded px-3 py-2" placeholder="Dodaj komentar..." />
        <button onClick={add} className="px-3 py-2 rounded bg-slate-900 text-white">Pošalji</button>
      </div>
      {comments.map(c=>(
        <div key={c.id} className="border rounded p-2">
          <div className="text-sm"><span className="font-medium">{c.author_name}</span> • <span className="text-slate-500">{new Date(c.created_at).toLocaleString()}</span></div>
          <div>{c.body}</div>
          {user?.id === c.user_id && <button onClick={()=>del(c.id)} className="text-xs text-red-600">Obriši</button>}
        </div>
      ))}
    </div>
  );
}
