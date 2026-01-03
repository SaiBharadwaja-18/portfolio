'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';

type Achievement = Database['achievements'];

export default function AdminAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<Partial<Achievement>>({
    title: '',
    title_jp: '',
    description: '',
    description_jp: '',
    date: '',
    image: '',
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  // 🔹 FETCH
  async function fetchAchievements() {
    const { data } = await supabase
      .from('achievements')
      .select('*')
      .order('date', { ascending: false });

    if (data) setAchievements(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchAchievements();
  }, []);

  // 🔹 SAVE (Create / Update)
  async function handleSave() {
    if (!form.title || !form.description || !form.date) {
      alert('Title, description, and date are required');
      return;
    }

    if (editingId) {
      await supabase
        .from('achievements')
        .update(form)
        .eq('id', editingId);
    } else {
      await supabase.from('achievements').insert(form);
    }

    setForm({
      title: '',
      title_jp: '',
      description: '',
      description_jp: '',
      date: '',
      image: '',
    });
    setEditingId(null);
    fetchAchievements();
  }

  // 🔹 EDIT
  function handleEdit(item: Achievement) {
    setEditingId(item.id);
    setForm(item);
  }

  // 🔹 DELETE
  async function handleDelete(id: string) {
    if (!confirm('Delete this achievement?')) return;

    await supabase.from('achievements').delete().eq('id', id);
    fetchAchievements();
  }

  return (
    <div className="max-w-5xl mx-auto py-12 space-y-10">

      <h1 className="text-3xl font-bold">Manage Achievements</h1>

      {/* FORM */}
      <div className="space-y-4 border rounded-xl p-6 bg-white">
        <Input
          placeholder="Title (EN)"
          value={form.title || ''}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <Input
          placeholder="Title (JP)"
          value={form.title_jp || ''}
          onChange={(e) => setForm({ ...form, title_jp: e.target.value })}
        />
        <Textarea
          placeholder="Description (EN)"
          value={form.description || ''}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <Textarea
          placeholder="Description (JP)"
          value={form.description_jp || ''}
          onChange={(e) => setForm({ ...form, description_jp: e.target.value })}
        />
        <Input
          type="date"
          value={form.date ? form.date.split('T')[0] : ''}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <Input
          placeholder="Image URL (optional)"
          value={form.image || ''}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
        />

        <Button onClick={handleSave}>
          {editingId ? 'Update Achievement' : 'Add Achievement'}
        </Button>
      </div>

      {/* LIST */}
      {loading ? (
        <p>Loading…</p>
      ) : (
        <div className="space-y-4">
          {achievements.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 flex justify-between items-start"
            >
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-600">
                  {format(new Date(item.date), 'MMM yyyy')}
                </p>
                <p className="text-sm mt-2">{item.description}</p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => handleEdit(item)}>
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(item.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
