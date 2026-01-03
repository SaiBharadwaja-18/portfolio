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
import { Trash2, Edit, Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Database['projects'][]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    title_jp: '',
    description: '',
    description_jp: '',
    images: '',
    tech_stack: '',
    project_link: '',
    github_link: '',
  });
  const router = useRouter();

  useEffect(() => {
    async function init() {
      const { user } = await getUser();
      if (!user) {
        router.push('/admin');
        return;
      }
      fetchProjects();
    }
    init();
  }, [router]);

  async function fetchProjects() {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('order_index', { ascending: true });
    if (data) setProjects(data);
    setLoading(false);
  }

  async function handleSave() {
    const images = formData.images ? formData.images.split(',').map((s) => s.trim()) : [];
    const tech_stack = formData.tech_stack ? formData.tech_stack.split(',').map((s) => s.trim()) : [];

    if (editing) {
      await supabase
        .from('projects')
        .update({
          title: formData.title,
          title_jp: formData.title_jp || null,
          description: formData.description,
          description_jp: formData.description_jp || null,
          images,
          tech_stack,
          project_link: formData.project_link || null,
          github_link: formData.github_link || null,
        })
        .eq('id', editing);
    } else {
      await supabase.from('projects').insert({
        title: formData.title,
        title_jp: formData.title_jp || null,
        description: formData.description,
        description_jp: formData.description_jp || null,
        images,
        tech_stack,
        project_link: formData.project_link || null,
        github_link: formData.github_link || null,
      });
    }

    resetForm();
    fetchProjects();
  }

  async function handleDelete(id: string) {
    if (confirm('Are you sure?')) {
      await supabase.from('projects').delete().eq('id', id);
      fetchProjects();
    }
  }

  function handleEdit(project: Database['projects']) {
    setEditing(project.id);
    setFormData({
      title: project.title,
      title_jp: project.title_jp || '',
      description: project.description,
      description_jp: project.description_jp || '',
      images: project.images?.join(', ') || '',
      tech_stack: project.tech_stack?.join(', ') || '',
      project_link: project.project_link || '',
      github_link: project.github_link || '',
    });
  }

  function resetForm() {
    setEditing(null);
    setFormData({
      title: '',
      title_jp: '',
      description: '',
      description_jp: '',
      images: '',
      tech_stack: '',
      project_link: '',
      github_link: '',
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

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Projects</h1>

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

              <div>
                <Label>Description (EN)</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label>Description (JP)</Label>
                <Textarea
                  value={formData.description_jp}
                  onChange={(e) => setFormData({ ...formData, description_jp: e.target.value })}
                  rows={3}
                />
              </div>

              <div>
                <Label>Images (comma-separated URLs)</Label>
                <Input
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                />
              </div>

              <div>
                <Label>Tech Stack (comma-separated)</Label>
                <Input
                  value={formData.tech_stack}
                  onChange={(e) => setFormData({ ...formData, tech_stack: e.target.value })}
                  placeholder="React, Node.js, TypeScript"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Project Link</Label>
                  <Input
                    value={formData.project_link}
                    onChange={(e) => setFormData({ ...formData, project_link: e.target.value })}
                  />
                </div>
                <div>
                  <Label>GitHub Link</Label>
                  <Input
                    value={formData.github_link}
                    onChange={(e) => setFormData({ ...formData, github_link: e.target.value })}
                  />
                </div>
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
          {projects.map((project) => (
            <Card key={project.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{project.description.slice(0, 100)}...</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(project)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(project.id)}>
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
