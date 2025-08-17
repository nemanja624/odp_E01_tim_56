export default function CourseTabs({
  tab,
  setTab,
}: {
  tab: "ann" | "mat";
  setTab: (t: "ann" | "mat") => void;
}) {
  const base = "px-4 py-2 rounded-lg text-sm transition select-none";
  const active = "bg-indigo-600 text-white shadow-sm";
  const idle = "text-slate-700 hover:bg-slate-100";

  return (
    <div className="mb-4">
      <div className="inline-flex gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
        <button
          onClick={() => setTab("ann")}
          className={`${base} ${tab === "ann" ? active : idle}`}
        >
          📢 Obaveštenja
        </button>
        <button
          onClick={() => setTab("mat")}
          className={`${base} ${tab === "mat" ? active : idle}`}
        >
          📚 Materijali
        </button>
      </div>
    </div>
  );
}
