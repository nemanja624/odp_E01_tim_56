export default function CourseTabs({ tab, setTab }:{ tab:"ann"|"mat"; setTab:(t:"ann"|"mat")=>void }){
  return (
    <div className="flex gap-2 mb-4">
      <button onClick={()=>setTab('ann')} className={`px-3 py-1 rounded ${tab==='ann'?'bg-blue-600 text-white':'bg-gray-200'}`}>Obaveštenja</button>
      <button onClick={()=>setTab('mat')} className={`px-3 py-1 rounded ${tab==='mat'?'bg-blue-600 text-white':'bg-gray-200'}`}>Nastavni materijali</button>
    </div>
  );
}
