import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import CourseTabs from "../components/CourseTabs";
import { http } from "../api/http";
import { useAuth } from "../auth/useAuth";
import AnnouncementCard from "../components/AnnouncementCard";
import CommentList from "../components/CommentList";

export default function CourseDetails(){
  const { id } = useParams();
  const courseId = Number(id);
  const { user } = useAuth();
  const [tab,setTab]=useState<"ann"|"mat">("ann");
  const [anns,setAnns]=useState<any[]>([]);
  const [mats,setMats]=useState<any[]>([]);
  const [formAnn, setFormAnn] = useState({ title:"", content:"", image:null as File|null });
  const [formMat, setFormMat] = useState({ title:"", description:"", file:null as File|null });

  const load = async ()=>{
    const a = await http.get(`/announcements/course/${courseId}`); setAnns(a.data);
    const m = await http.get(`/materials/course/${courseId}`); setMats(m.data);
  };
  useEffect(()=>{ load(); },[courseId]);

  const submitAnn = async (e:React.FormEvent)=>{
    e.preventDefault();
    const fd = new FormData(); fd.append("title", formAnn.title); fd.append("content", formAnn.content); if(formAnn.image) fd.append("image", formAnn.image);
    await http.post(`/announcements/course/${courseId}`, fd, { headers:{"Content-Type":"multipart/form-data"}});
    setFormAnn({ title:"", content:"", image:null }); load();
  };
  const submitMat = async (e:React.FormEvent)=>{
    e.preventDefault(); const fd = new FormData(); fd.append("title", formMat.title); if(formMat.description) fd.append("description", formMat.description); if(formMat.file) fd.append("file", formMat.file);
    await http.post(`/materials/course/${courseId}`, fd, { headers:{"Content-Type":"multipart/form-data"}});
    setFormMat({ title:"", description:"", file:null }); load();
  };

  const delMat = async (id:number)=>{ await http.delete(`/materials/${id}`); load(); };

  return (
    <div>
      <NavBar/>
      <div className="max-w-4xl mx-auto p-4">
        <CourseTabs tab={tab} setTab={setTab}/>

        {tab==='ann' && (
          <div className="flex flex-col gap-4">
            {user?.role==='PROFESSOR' && (
              <form onSubmit={submitAnn} className="bg-white border rounded-xl p-4">
                <div className="text-lg font-semibold mb-2">Novo obaveštenje</div>
                <input className="border p-2 rounded w-full mb-2" placeholder="Naslov (opciono)" value={formAnn.title} onChange={e=>setFormAnn({...formAnn, title:e.target.value})} />
                <textarea className="border p-2 rounded w-full mb-2" placeholder="Tekst" value={formAnn.content} onChange={e=>setFormAnn({...formAnn, content:e.target.value})}/>
                <input type="file" accept="image/png,image/jpeg" onChange={e=>setFormAnn({...formAnn, image:e.target.files?.[0]||null})} />
                <button className="mt-2 px-3 py-1 bg-blue-600 text-white rounded">Objavi</button>
              </form>
            )}

            {anns.map(a => (
              <div key={a.id}>
                <AnnouncementCard a={a} onChanged={load}/>
                <div className="mt-2"><CommentList announcementId={a.id}/></div>
              </div>
            ))}
          </div>
        )}

        {tab==='mat' && (
          <div className="flex flex-col gap-4">
            {user?.role==='PROFESSOR' && (
              <form onSubmit={submitMat} className="bg-white border rounded-xl p-4">
                <div className="text-lg font-semibold mb-2">Dodaj materijal (PDF/TXT)</div>
                <input className="border p-2 rounded w-full mb-2" placeholder="Naslov" value={formMat.title} onChange={e=>setFormMat({...formMat, title:e.target.value})} />
                <input className="border p-2 rounded w-full mb-2" placeholder="Opis (opciono)" value={formMat.description} onChange={e=>setFormMat({...formMat, description:e.target.value})} />
                <input type="file" accept="application/pdf,text/plain" onChange={e=>setFormMat({...formMat, file:e.target.files?.[0]||null})} />
                <button className="mt-2 px-3 py-1 bg-blue-600 text-white rounded">Dodaj</button>
              </form>
            )}

            <div className="grid sm:grid-cols-2 gap-3">
              {mats.map(m => (
                <div key={m.id} className="bg-white border rounded-xl p-4">
                  <div className="font-semibold">{m.title}</div>
                  <div className="text-sm text-gray-600">{m.description||""}</div>
                  <a className="text-blue-600 block mt-2" href={m.fileUrl} target="_blank">Preuzmi</a>
                  {user?.role==='PROFESSOR' && <button onClick={()=>delMat(m.id)} className="text-red-600 text-sm mt-1">Obriši</button>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
