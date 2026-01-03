'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Highlight = {
  id: string;
  title: string;
  title_jp?: string | null;
  description: string;
  description_jp?: string | null;
  image_url?: string | null;
  date: string;
};

export default function HighlightsAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    title_jp: '',
    description: '',
    description_jp: '',
    image_url: '',
    date: '',
  });

  // 🔐 SAME AUTH GUARD AS PROJECTS
  useEffect(() => {
    async function init() {
      const { user } = await getUser();
      if (!user) {
        router.push('/admin');
        return;
      }
      await fetchHighlights();
      setLoading(false);
    }
    init();
  }, [router]);

  async function fetchHighlights() {
    const { data, error } = await supabase
      .from('highlights')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error(error);
      return;
    }
    setHighlights(data || []);
  }

  async function handleSave() {
    if (!formData.title || !formData.description || !formData.date) {
      alert('Title, description and date are required');
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from('highlights')
        .update({
          title: formData.title,
          title_jp: formData.title_jp || null,
          description: formData.description,
          description_jp: formData.description_jp || null,
          image_url: formData.image_url || null,
          date: formData.date,
        })
        .eq('id', editingId);

      if (error) {
        console.error(error);
        alert(error.message);
        return;
      }
    } else {
      const { error } = await supabase.from('highlights').insert({
        title: formData.title,
        title_jp: formData.title_jp || null,
        description: formData.description,
        description_jp: formData.description_jp || null,
        image_url: formData.image_url || null,
        date: formData.date,
      });

      if (error) {
        console.error(error);
        alert(error.message);
        return;
      }
    }

    resetForm();
    fetchHighlights();
  }

  function handleEdit(h: Highlight) {
    setEditingId(h.id);
    setFormData({
      title: h.title,
      title_jp: h.title_jp || '',
      description: h.description,
      description_jp: h.description_jp || '',
      image_url: h.image_url || '',
      date: h.date,
    });
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this highlight?')) return;

    const { error } = await supabase.from('highlights').delete().eq('id', id);
    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }
    fetchHighlights();
  }

  function resetForm() {
    setEditingId(null);
    setFormData({
      title: '',
      title_jp: '',
      description: '',
      description_jp: '',
      image_url: '',
      date: '',
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-10">
      <h1 className="text-3xl font-bold">Highlights</h1>

      {/* FORM */}
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? 'Edit Highlight' : 'Add Highlight'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            className="w-full border rounded p-3"
            placeholder="Title (EN)"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <input
            className="w-full border rounded p-3"
            placeholder="Title (JP)"
            value={formData.title_jp}
            onChange={(e) =>
              setFormData({ ...formData, title_jp: e.target.value })
            }
          />
          <textarea
            className="w-full border rounded p-3"
            rows={3}
            placeholder="Description (EN)"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
          <textarea
            className="w-full border rounded p-3"
            rows={3}
            placeholder="Description (JP)"
            value={formData.description_jp}
            onChange={(e) =>
              setFormData({ ...formData, description_jp: e.target.value })
            }
          />
          <input
            className="w-full border rounded p-3"
            placeholder="Image URL (Cloudinary)"
            value={formData.image_url}
            onChange={(e) =>
              setFormData({ ...formData, image_url: e.target.value })
            }
          />
          <input
            type="date"
            className="w-full border rounded p-3"
            value={formData.date}
            onChange={(e) =>
              setFormData({ ...formData, date: e.target.value })
            }
          />

          <div className="flex gap-3">
            <Button onClick={handleSave}>
              {editingId ? 'Update' : 'Add'}
            </Button>
            {editingId && (
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* LIST */}
      {highlights.map((h) => (
        <Card key={h.id}>
          <CardContent className="flex items-center gap-4 p-4">
            {h.image_url && (
              <img
                src={h.image_url}
                className="w-24 h-16 object-cover rounded"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold">{h.title}</h3>
              <p className="text-sm text-gray-500">{h.date}</p>
            </div>
            <Button variant="outline" onClick={() => handleEdit(h)}>
              Edit
            </Button>
            <Button variant="destructive" onClick={() => handleDelete(h.id)}>
              Delete
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
