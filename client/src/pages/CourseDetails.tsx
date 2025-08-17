import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import CourseTabs from "../components/CourseTabs";
import { http, API_ORIGIN } from "../api/http";
import { useAuth } from "../auth/useAuth";
import AnnouncementCard from "../components/AnnouncementCard";
import CommentList from "../components/CommentList";

type Announcement = { id:number; authorId:number; title?:string|null; content?:string|null; imageUrl?:string|null; createdAt?:string|null };
type Material = { id:number; title:string; description?:string; fileUrl:string };

export default function CourseDetails(){
  const { id } = useParams(); const courseId = Number(id);
  const { user } = useAuth();

  const [tab,setTab] = useState<"ann"|"mat">("ann");
  const [anns,setAnns] = useState<Announcement[]>([]);
  const [mats,setMats] = useState<Material[]>([]);
  const [formAnn, setFormAnn] = useState({ title:"", content:"", image:null as File|null });
  const [formMat, setFormMat] = useState({ title:"", description:"", file:null as File|null });
  const [enrolled, setEnrolled] = useState(true);

  const load = async ()=>{
    try{
      const [a,m] = await Promise.all([
        http.get(`/announcements/course/${courseId}`),
        http.get(`/materials/course/${courseId}`)
      ]);
      setAnns(a.data||[]); setMats(m.data||[]); setEnrolled(true);
    }catch(e:any){
      if(e?.response?.status===403){ setEnrolled(false); setAnns([]); setMats([]); }
    }
  };
  useEffect(()=>{ if(courseId) load(); },[courseId]);

  const submitAnn = async (e:React.FormEvent)=>{
    e.preventDefault();
    const fd = new FormData();
    fd.append("title", formAnn.title);
    fd.append("content", formAnn.content);
    if(formAnn.image) fd.append("image", formAnn.image);
    await http.post(`/announcements/course/${courseId}`, fd, { headers:{ "Content-Type":"multipart/form-data" }});
    setFormAnn({ title:"", content:"", image:null }); load();
  };

  const submitMat = async (e:React.FormEvent)=>{
    e.preventDefault();
    const fd = new FormData();
    fd.append("title", formMat.title);
    if(formMat.description) fd.append("description", formMat.description);
    if(formMat.file) fd.append("file", formMat.file);
    await http.post(`/materials/course/${courseId}`, fd, { headers:{ "Content-Type":"multipart/form-data" }});
    setFormMat({ title:"", description:"", file:null }); load();
  };

  const delMat = async (mid:number)=>{ await http.delete(`/materials/${mid}`); load(); };

  return (
    <div>
      <NavBar/>
      <div className="container-page">
        <CourseTabs tab={tab} setTab={setTab}/>

        {!enrolled && (
          <div className="section border-amber-300 bg-amber-50 text-amber-900">
            Niste upisani na ovaj kurs. Upišite se (max 3 kursa po korisniku) da biste videli sadržaj.
          </div>
        )}

        {enrolled && tab==='ann' && (
          <div className="flex flex-col gap-4">
            {user?.role==='PROFESSOR' && (
              <form onSubmit={submitAnn} className="section">
                <div className="text-lg font-semibold mb-2">Novo obaveštenje</div>
                <input className="input mb-2" placeholder="Naslov (opciono)"
                  value={formAnn.title} onChange={e=>setFormAnn({...formAnn, title:e.target.value})}/>
                <textarea className="textarea mb-2" placeholder="Tekst obaveštenja"
                  value={formAnn.content} onChange={e=>setFormAnn({...formAnn, content:e.target.value})}/>
                <input type="file" accept="image/png,image/jpeg" onChange={e=>setFormAnn({...formAnn, image:e.target.files?.[0]||null})}/>
                <div className="mt-3"><button className="btn-primary">Objavi</button></div>
              </form>
            )}

            {anns.filter(Boolean).map(a => (
              <div key={a!.id} className="section">
                <AnnouncementCard a={a} onChanged={load}/>
                <div className="mt-3"><CommentList announcementId={a!.id}/></div>
              </div>
            ))}
          </div>
        )}

        {enrolled && tab==='mat' && (
          <div className="flex flex-col gap-4">
            {user?.role==='PROFESSOR' && (
              <form onSubmit={submitMat} className="section">
                <div className="text-lg font-semibold mb-2">Dodaj materijal (PDF/TXT)</div>
                <input className="input mb-2" placeholder="Naslov"
                  value={formMat.title} onChange={e=>setFormMat({...formMat, title:e.target.value})}/>
                <input className="input mb-2" placeholder="Opis (opciono)"
                  value={formMat.description} onChange={e=>setFormMat({...formMat, description:e.target.value})}/>
                <input type="file" accept="application/pdf,text/plain"
                  onChange={e=>setFormMat({...formMat, file:e.target.files?.[0]||null})}/>
                <div className="mt-3"><button className="btn-primary">Dodaj</button></div>
              </form>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              {mats.filter(Boolean).map(m => (
                <div key={m!.id} className="card p-4">
                  <div className="font-semibold">{m!.title}</div>
                  <div className="text-sm text-slate-600">{m!.description||""}</div>
                  <a className="text-indigo-700 underline mt-2 inline-block"
                     href={`${API_ORIGIN}${m!.fileUrl}`} target="_blank" rel="noreferrer">
                    ⬇ Preuzmi
                  </a>
                  {user?.role==='PROFESSOR' && (
                    <button onClick={()=>delMat(m!.id)} className="btn-danger mt-2">Obriši</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
