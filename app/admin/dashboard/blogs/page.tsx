'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { Trash2, Edit, Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function BlogsAdmin() {
  const [blogs, setBlogs] = useState<Database['blogs'][]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    title_jp: '',
    slug: '',
    category: '',
    content: '',
    content_jp: '',
    images: '',
    audio_url: '',
    status: 'draft',
  });
  const router = useRouter();

  useEffect(() => {
    async function init() {
      const { user } = await getUser();
      if (!user) {
        router.push('/admin');
        return;
      }
      fetchBlogs();
    }
    init();
  }, [router]);

  async function fetchBlogs() {
    const { data } = await supabase
      .from('blogs')
      .select('*')
      .order('publish_date', { ascending: false });
    if (data) setBlogs(data);
    setLoading(false);
  }

  async function handleSave() {
    const images = formData.images ? formData.images.split(',').map((s) => s.trim()) : [];

    if (editing) {
      await supabase
        .from('blogs')
        .update({
          title: formData.title,
          title_jp: formData.title_jp || null,
          slug: formData.slug,
          category: formData.category,
          content: formData.content,
          content_jp: formData.content_jp || null,
          images,
          audio_url: formData.audio_url || null,
          status: formData.status,
        })
        .eq('id', editing);
    } else {
      await supabase.from('blogs').insert({
        title: formData.title,
        title_jp: formData.title_jp || null,
        slug: formData.slug,
        category: formData.category,
        content: formData.content,
        content_jp: formData.content_jp || null,
        images,
        audio_url: formData.audio_url || null,
        status: formData.status,
      });
    }

    resetForm();
    fetchBlogs();
  }

  async function handleDelete(id: string) {
    if (confirm('Are you sure?')) {
      await supabase.from('blogs').delete().eq('id', id);
      fetchBlogs();
    }
  }

  function handleEdit(blog: Database['blogs']) {
    setEditing(blog.id);
    setFormData({
      title: blog.title,
      title_jp: blog.title_jp || '',
      slug: blog.slug,
      category: blog.category,
      content: blog.content,
      content_jp: blog.content_jp || '',
      images: blog.images?.join(', ') || '',
      audio_url: blog.audio_url || '',
      status: blog.status,
    });
  }

  function resetForm() {
    setEditing(null);
    setFormData({
      title: '',
      title_jp: '',
      slug: '',
      category: '',
      content: '',
      content_jp: '',
      images: '',
      audio_url: '',
      status: 'draft',
    });
  }

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/admin/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Blogs</h1>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Title (EN)</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Title (JP)</Label>
                  <Input
                    value={formData.title_jp}
                    onChange={(e) => setFormData({ ...formData, title_jp: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Slug</Label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>Content (EN) - Markdown supported</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                />
              </div>

              <div>
                <Label>Content (JP) - Markdown supported</Label>
                <Textarea
                  value={formData.content_jp}
                  onChange={(e) => setFormData({ ...formData, content_jp: e.target.value })}
                  rows={6}
                />
              </div>

              <div>
                <Label>Images (comma-separated URLs)</Label>
                <Input
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                />
              </div>

              <div>
                <Label>Japanese Audio URL (optional)</Label>
                <Input
                  value={formData.audio_url}
                  onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
                  placeholder="https://example.com/audio.mp3"
                />
              </div>

              <div>
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4">
                <Button onClick={handleSave}>
                  {editing ? 'Update' : <><Plus className="w-4 h-4 mr-2" />Create</>}
                </Button>
                {editing && (
                  <Button onClick={resetForm} variant="outline">
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {blogs.map((blog) => (
            <Card key={blog.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{blog.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {blog.category} • {format(new Date(blog.publish_date), 'MMM d, yyyy')} • {blog.status}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(blog)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(blog.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
