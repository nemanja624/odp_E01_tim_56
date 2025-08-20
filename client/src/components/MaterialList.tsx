import React from 'react';
import { api, SERVER_BASE } from '../api';
import { useAuth } from '../hooks/useAuth';

export default function MaterialList({ courseId }: { courseId: number }) {
  const { user } = useAuth();
  const [materials, setMaterials] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  async function fetchAll() {
    setLoading(true);
    try {
      const r = await api.get(`/materials/course/${courseId}`);
      setMaterials(r.data.materials || []);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  async function del(id: number) {
    if (!confirm('Obrisati materijal?')) return;
    await api.delete(`/materials/${id}`);
    fetchAll();
  }

  if (loading && materials.length === 0) {
    return <div className="text-sm text-slate-500">Učitavanje...</div>;
  }

  return (
    <div className="space-y-2">
      {materials.length === 0 && (
        <div className="text-sm text-slate-500">Nema materijala za ovaj kurs.</div>
      )}

      {materials.map((m) => (
        <div
          key={m.id}
          className="bg-white rounded shadow p-3 flex items-center justify-between gap-3"
        >
          <div>
            <div className="font-semibold">{m.title}</div>
            <div className="text-sm text-slate-500">
              Autor: {m.author_name} • {new Date(m.created_at).toLocaleString()}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`${SERVER_BASE}/api/materials/${m.id}/download`}
              className="px-3 py-1 rounded bg-slate-900 text-white"
            >
              Preuzmi
            </a>

            {user?.role === 'PROFESSOR' && (
              <button
                onClick={() => del(m.id)}
                className="px-3 py-1 rounded bg-red-600 text-white"
                title="Obriši materijal"
              >
                Obriši
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
