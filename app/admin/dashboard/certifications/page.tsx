'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';

type Certification = Database['certifications'];

export default function AdminCertifications() {
  const [items, setItems] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    title_jp: '',
    description: '',
    description_jp: '',
    type: 'certificate',
    date: '',
    download_url: '',
    images: '',
  });

  /* ---------------- FETCH ---------------- */
  async function fetchCertifications() {
    setLoading(true);
    const { data } = await supabase
      .from('certifications')
      .select('*')
      .order('date', { ascending: false });

    if (data) setItems(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchCertifications();
  }, []);

  /* ---------------- SAVE ---------------- */
  async function handleSave() {
    const payload = {
      ...form,
      images: form.images
        ? form.images.split(',').map((i) => i.trim())
        : [],
      date: form.date ? new Date(form.date).toISOString() : new Date().toISOString(),
    };

    if (editingId) {
      await supabase.from('certifications').update(payload).eq('id', editingId);
    } else {
      await supabase.from('certifications').insert(payload);
    }

    resetForm();
    fetchCertifications();
  }

  /* ---------------- EDIT ---------------- */
  function handleEdit(item: Certification) {
    setEditingId(item.id);
    setForm({
      title: item.title,
      title_jp: item.title_jp || '',
      description: item.description,
      description_jp: item.description_jp || '',
      type: item.type,
      date: item.date?.slice(0, 10) || '',
      download_url: item.download_url || '',
      images: item.images?.join(', ') || '',
    });
  }

  /* ---------------- DELETE ---------------- */
  async function handleDelete(id: string) {
    if (!confirm('Delete this certification?')) return;
    await supabase.from('certifications').delete().eq('id', id);
    fetchCertifications();
  }

  function resetForm() {
    setEditingId(null);
    setForm({
      title: '',
      title_jp: '',
      description: '',
      description_jp: '',
      type: 'certificate',
      date: '',
      download_url: '',
      images: '',
    });
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Manage Certifications</h1>

      {/* FORM */}
      <div className="bg-white dark:bg-gray-900 border rounded-xl p-6 mb-10 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <input
            placeholder="Title (EN)"
            className="input"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            placeholder="Title (JP)"
            className="input"
            value={form.title_jp}
            onChange={(e) => setForm({ ...form, title_jp: e.target.value })}
          />
        </div>

        <textarea
          placeholder="Description (EN)"
          className="input h-24"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <textarea
          placeholder="Description (JP)"
          className="input h-24"
          value={form.description_jp}
          onChange={(e) => setForm({ ...form, description_jp: e.target.value })}
        />

        <div className="grid md:grid-cols-3 gap-4">
          <select
            className="input"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="certificate">Certificate</option>
            <option value="lor">Letter of Recommendation</option>
            <option value="other">Other</option>
          </select>

          <input
            type="date"
            className="input"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />

          <input
            placeholder="Download URL (PDF)"
            className="input"
            value={form.download_url}
            onChange={(e) => setForm({ ...form, download_url: e.target.value })}
          />
        </div>

        <input
          placeholder="Image URLs (comma separated)"
          className="input"
          value={form.images}
          onChange={(e) => setForm({ ...form, images: e.target.value })}
        />

        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="px-6 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
          >
            {editingId ? 'Update' : 'Create'}
          </button>
          {editingId && (
            <button onClick={resetForm} className="px-6 py-2 rounded-lg border">
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* LIST */}
      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 flex justify-between items-start bg-white dark:bg-gray-900"
            >
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item.type} • {new Date(item.date).toLocaleDateString()}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-sm text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-sm text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
