import { useEffect, useState } from "react";
import { http, API_ORIGIN } from "../api/http";
import { useAuth } from "../auth/useAuth";

type Announcement = {
  id: number;
  authorId: number;
  title?: string | null;
  content?: string | null;
  imageUrl?: string | null;
  createdAt?: string | null;
};

type ReactionRow = { value: "LIKE" | "DISLIKE"; _count: { value: number } };
const toCounts = (rows: ReactionRow[]) => ({
  LIKE: rows.find(r => r.value === "LIKE")?._count.value ?? 0,
  DISLIKE: rows.find(r => r.value === "DISLIKE")?._count.value ?? 0
});

export default function AnnouncementCard({
  a,
  onChanged,
}: {
  a: Announcement | undefined;
  onChanged: () => void;
}) {
  if (!a) return null; // ⬅ zaštita

  const { user } = useAuth();
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState<string>(a.title ?? "");
  const [content, setContent] = useState<string>(a.content ?? "");
  const [counts, setCounts] = useState<{ LIKE: number; DISLIKE: number }>({ LIKE: 0, DISLIKE: 0 });

  const canEdit = user?.role === "PROFESSOR" && user.id === a.authorId;

  const refreshCounts = async () => {
    try {
      const r = await http.get<ReactionRow[]>(`/announcements/${a.id}/reactions`);
      setCounts(toCounts(r.data));
    } catch {}
  };
  useEffect(() => { refreshCounts(); }, [a.id]);

  const react = async (value: "LIKE" | "DISLIKE") => {
    await http.post(`/announcements/${a.id}/reactions`, { value });
    await refreshCounts();
    onChanged();
  };

  const save = async () => {
    await http.put(`/announcements/${a.id}`, { title, content });
    setEdit(false);
    onChanged();
  };

  const remove = async () => {
    if (!confirm("Obriši obaveštenje?")) return;
    await http.delete(`/announcements/${a.id}`);
    onChanged();
  };

  const createdLabel = a.createdAt ? new Date(a.createdAt).toLocaleString() : "";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {edit ? (
        <div className="flex flex-col gap-2">
          <input
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Naslov (opciono)"
          />
          <textarea
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700" onClick={save}>
              Sačuvaj
            </button>
            <button className="px-3 py-1 rounded-lg bg-slate-200 hover:bg-slate-300" onClick={() => setEdit(false)}>
              Otkaži
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-slate-800 font-semibold">{a.title ?? "Obaveštenje"}</div>
              <div className="text-xs text-slate-500 mt-0.5">{createdLabel}</div>
            </div>
            {canEdit && (
              <div className="flex gap-2">
                <button
                  className="text-xs px-2 py-1 rounded-lg bg-amber-100 text-amber-900 hover:bg-amber-200"
                  onClick={() => setEdit(true)}
                >
                  Izmeni
                </button>
                <button
                  className="text-xs px-2 py-1 rounded-lg bg-rose-100 text-rose-900 hover:bg-rose-200"
                  onClick={remove}
                >
                  Obriši
                </button>
              </div>
            )}
          </div>

          <div className="mt-2 whitespace-pre-wrap text-slate-700">{a.content ?? ""}</div>

          {a.imageUrl && (
            <img
              src={`${API_ORIGIN}${a.imageUrl}`}
              className="mt-3 rounded-xl border"
              alt="Slika iz obaveštenja"
            />
          )}

          <div className="flex items-center gap-3 mt-3">
            <button
              className="text-sm px-2 py-1 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
              onClick={() => react("LIKE")}
              title="Sviđa mi se"
            >
              👍 Like {counts.LIKE > 0 && <span>({counts.LIKE})</span>}
            </button>
            <button
              className="text-sm px-2 py-1 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
              onClick={() => react("DISLIKE")}
              title="Ne sviđa mi se"
            >
              👎 Dislike {counts.DISLIKE > 0 && <span>({counts.DISLIKE})</span>}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
