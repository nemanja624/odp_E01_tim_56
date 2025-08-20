import { api } from '../api';
import { SERVER_BASE } from '../api'; // na 20oj liniji je promena a i ovde
import { useAuth } from '../hooks/useAuth';
export default function AnnouncementCard({ a, onRefresh }:{ a:any, onRefresh:()=>void }){
  const { user } = useAuth();
  async function react(type:'LIKE'|'DISLIKE'){
    await api.post(`/announcements/${a.id}/react`, { type });
    onRefresh();
  }
  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">{a.title}</div>
          <div className="text-sm text-slate-500">Autor: {a.author_name}</div>
        </div>
        <div className="text-xs text-slate-500">{new Date(a.created_at).toLocaleString()}</div>
      </div>
      {a.body && <p className="text-slate-700">{a.body}</p>}
      {a.image_url && <img className="rounded-lg max-h-72 object-contain" src={`${SERVER_BASE}${a.image_url}`} />}                                                   
      <div className="flex items-center gap-3 text-sm"> 
        <button onClick={()=>react('LIKE')} className={`px-2 py-1 rounded border ${a.me_liked?'bg-slate-900 text-white':'bg-white'}`}>Like ({a.likes})</button>
        <button onClick={()=>react('DISLIKE')} className={`px-2 py-1 rounded border ${a.me_disliked?'bg-slate-900 text-white':'bg-white'}`}>Dislike ({a.dislikes})</button>
      </div>
    </div>
  );
}
