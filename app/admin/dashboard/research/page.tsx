'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

type Research = {
  id?: string;
  title: string;
  title_jp?: string;
  date: string;
  venue?: string;
  venue_jp?: string;
  status?: string;
  abstract?: string;
  abstract_jp?: string;
  paper_link?: string;
  image_url?: string;
  authors?: string[];
  keywords?: string[];
};

const emptyForm: Research = {
  title: '',
  title_jp: '',
  date: '',
  venue: '',
  venue_jp: '',
  status: 'Accepted',
  abstract: '',
  abstract_jp: '',
  paper_link: '',
  image_url: '',
  authors: [],
  keywords: [],
};

export default function ResearchAdmin() {
  const [items, setItems] = useState<Research[]>([]);
  const [form, setForm] = useState<Research>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchResearch();
  }, []);

  async function fetchResearch() {
    const { data } = await supabase
      .from('research')
      .select('*')
      .order('date', { ascending: false });

    if (data) setItems(data);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSave() {
    setLoading(true);

    const payload = {
      ...form,
      authors:
        typeof form.authors === 'string'
          ? (form.authors as any).split(',').map((a: string) => a.trim())
          : form.authors,
      keywords:
        typeof form.keywords === 'string'
          ? (form.keywords as any).split(',').map((k: string) => k.trim())
          : form.keywords,
    };

    if (editingId) {
      await supabase.from('research').update(payload).eq('id', editingId);
    } else {
      await supabase.from('research').insert(payload);
    }

    setForm(emptyForm);
    setEditingId(null);
    setLoading(false);
    fetchResearch();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this research entry?')) return;
    await supabase.from('research').delete().eq('id', id);
    fetchResearch();
  }

  function handleEdit(item: Research) {
    setForm({
      ...item,
      authors: item.authors || [],
      keywords: item.keywords || [],
    });
    setEditingId(item.id || null);
  }

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-10">

      {/* FORM */}
      <Card>
        <CardHeader>
          <CardTitle>
            {editingId ? 'Edit Research' : 'Add Research'}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input name="title" placeholder="Title (EN)" value={form.title} onChange={handleChange} />
          <Input name="title_jp" placeholder="Title (JP)" value={form.title_jp} onChange={handleChange} />
          <Input name="date" type="date" value={form.date} onChange={handleChange} />
          <Input name="venue" placeholder="Conference / Journal (EN)" value={form.venue} onChange={handleChange} />
          <Input name="venue_jp" placeholder="Conference / Journal (JP)" value={form.venue_jp} onChange={handleChange} />
          <Input name="status" placeholder="Status (Accepted / Published)" value={form.status} onChange={handleChange} />
          <Textarea name="abstract" placeholder="Abstract (EN)" value={form.abstract} onChange={handleChange} />
          <Textarea name="abstract_jp" placeholder="Abstract (JP)" value={form.abstract_jp} onChange={handleChange} />
          <Input name="paper_link" placeholder="Paper Link (IEEE / PDF)" value={form.paper_link} onChange={handleChange} />
          <Input name="image_url" placeholder="Image URL (Cloudinary)" value={form.image_url} onChange={handleChange} />

          <Input
            name="authors"
            placeholder="Authors (comma separated)"
            value={form.authors?.join(', ')}
            onChange={(e) =>
              setForm({ ...form, authors: e.target.value.split(',') })
            }
          />

          <Input
            name="keywords"
            placeholder="Keywords (comma separated)"
            value={form.keywords?.join(', ')}
            onChange={(e) =>
              setForm({ ...form, keywords: e.target.value.split(',') })
            }
          />

          <Button onClick={handleSave} disabled={loading}>
            {editingId ? 'Update' : 'Add'}
          </Button>
        </CardContent>
      </Card>

      {/* LIST */}
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex justify-between items-start py-4">
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-500">
                  {item.venue} • {item.status}
                </p>
              </div>

              <div className="flex gap-3">
                <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                  Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id!)}>
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
