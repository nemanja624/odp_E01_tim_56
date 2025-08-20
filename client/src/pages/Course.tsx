import React from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../hooks/useAuth';
import AnnouncementCard from '../components/AnnouncementCard';
import CommentList from '../components/CommentList';
import MaterialList from '../components/MaterialList';

export default function CoursePage(){
  const { id } = useParams();
  const courseId = Number(id);
  const { user } = useAuth();
  const [anns, setAnns] = React.useState<any[]>([]);
  const [title, setTitle] = React.useState('');
  const [body, setBody] = React.useState('');
  const [image, setImage] = React.useState<File|null>(null);
  const [tab, setTab] = React.useState<'ann'|'mat'>('ann');
  async function fetchAll(){
    const r = await api.get(`/announcements/course/${courseId}`);
    setAnns(r.data.announcements);
  }
  React.useEffect(()=>{ fetchAll(); },[courseId]);
  async function createAnn(e:React.FormEvent){
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', title);
    if (body) fd.append('body', body);
    if (image) fd.append('image', image);
    await api.post(`/announcements/course/${courseId}`, fd); // ovde je bila izmena
    setTitle(''); setBody(''); setImage(null);
    fetchAll();
  }
  async function uploadMat(e:React.FormEvent){
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const fd = new FormData(form);
    await api.post(`/materials/course/${courseId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    form.reset();
    alert('Materijal dodat');
  }
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <div className="flex gap-4">
        <button onClick={()=>setTab('ann')} className={`px-3 py-2 rounded ${tab==='ann'?'bg-slate-900 text-white':'bg-white border'}`}>Obaveštenja</button>
        <button onClick={()=>setTab('mat')} className={`px-3 py-2 rounded ${tab==='mat'?'bg-slate-900 text-white':'bg-white border'}`}>Materijali</button>
      </div>
      {tab==='ann' && (
        <div className="space-y-4">
          {user?.role==='PROFESSOR' && (
            <form onSubmit={createAnn} className="bg-white rounded-xl shadow p-4 space-y-2">
              <div className="font-semibold">Dodaj obaveštenje</div>
              <input className="border w-full rounded px-3 py-2" placeholder="Naslov" value={title} onChange={e=>setTitle(e.target.value)} />
              <textarea className="border w-full rounded px-3 py-2" placeholder="Tekst (opciono)" value={body} onChange={e=>setBody(e.target.value)} />
              <input type="file" accept="image/*" onChange={e=>setImage(e.target.files?.[0]||null)} />
              <button className="px-3 py-2 rounded bg-slate-900 text-white">Objavi</button>
            </form>
          )}
          <div className="space-y-3">
            {anns.map(a=>(
              <div key={a.id} className="space-y-3">
                <AnnouncementCard a={a} onRefresh={fetchAll}/>
                <div className="ml-2">
                  <CommentList announcementId={a.id} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {tab==='mat' && (
        <div className="space-y-4">
          {user?.role==='PROFESSOR' && (
            <form onSubmit={uploadMat} className="bg-white rounded-xl shadow p-4 space-y-2">
              <div className="font-semibold">Dodaj materijal (PDF/TXT)</div>
              <input name="title" className="border w-full rounded px-3 py-2" placeholder="Naslov" />
              <input name="description" className="border w-full rounded px-3 py-2" placeholder="Opis (opciono)" />
              <input name="file" type="file" accept=".pdf,.txt" />
              <button className="px-3 py-2 rounded bg-slate-900 text-white">Dodaj</button>
            </form>
          )}
          <MaterialList courseId={courseId} />
        </div>
      )}
    </div>
  );
}
