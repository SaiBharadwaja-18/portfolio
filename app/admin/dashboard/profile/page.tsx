'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProfileAdmin() {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
  name: '',
  name_jp: '',
  tagline: '',
  tagline_jp: '',
  bio: '',
  bio_jp: '',
  about_me: '',
  about_me_jp: '',
  education: '',
  education_jp: '',
  experience: '',
  experience_jp: '',
  avatar_url: '',
  resume_url_en: '',
  resume_url_jp: '',
  email: '',
  github: '',
  linkedin: '',
  twitter: '',
  });
  const router = useRouter();

  useEffect(() => {
    async function init() {
      const { user } = await getUser();
      if (!user) {
        router.push('/admin');
        return;
      }
      fetchProfile();
    }
    init();
  }, [router]);

  async function fetchProfile() {
    const { data } = await supabase.from('profile').select('*').maybeSingle();
    if (data) {
    setFormData({
    name: data.name || '',
    name_jp: data.name_jp || '',
    tagline: data.tagline || '',
    tagline_jp: data.tagline_jp || '',
    bio: data.bio || '',
    bio_jp: data.bio_jp || '',
    about_me: data.about_me || '',
    about_me_jp: data.about_me_jp || '',
    education: JSON.stringify(data.education || [], null, 2),
    education_jp: JSON.stringify(data.education_jp || [], null, 2),
    experience: JSON.stringify(data.experience || [], null, 2),
    experience_jp: JSON.stringify(data.experience_jp || [], null, 2),
    avatar_url: data.avatar_url || '',
    resume_url_en: data.resume_url_en || '',
    resume_url_jp: data.resume_url_jp || '',
    email: data.email || '',
    github: data.github || '',
    linkedin: data.linkedin || '',
    twitter: data.twitter || '',
  });


    }
    setLoading(false);
  }

  async function handleSave() {
  const { data: existing } = await supabase
    .from('profile')
    .select('id')
    .maybeSingle();

  const payload = {
    ...formData,
    education: JSON.parse(formData.education || '[]'),
    education_jp: JSON.parse(formData.education_jp || '[]'),
    experience: JSON.parse(formData.experience || '[]'),
    experience_jp: JSON.parse(formData.experience_jp || '[]'),
  };

  if (existing) {
    await supabase
      .from('profile')
      .update(payload)
      .eq('id', existing.id);
  } else {
    await supabase
      .from('profile')
      .insert(payload);
  }

  alert('Profile saved successfully!');
}


  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/admin/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Profile</h1>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Name (EN)</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <Label>Name (JP)</Label>
                  <Input value={formData.name_jp} onChange={(e) => setFormData({ ...formData, name_jp: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Tagline (EN)</Label>
                  <Input value={formData.tagline} onChange={(e) => setFormData({ ...formData, tagline: e.target.value })} />
                </div>
                <div>
                  <Label>Tagline (JP)</Label>
                  <Input value={formData.tagline_jp} onChange={(e) => setFormData({ ...formData, tagline_jp: e.target.value })} />
                </div>
              </div>

              <div>
                <Label>Bio (EN)</Label>
                <Textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} rows={4} />
              </div>

              <div>
                <Label>Bio (JP)</Label>
                <Textarea value={formData.bio_jp} onChange={(e) => setFormData({ ...formData, bio_jp: e.target.value })} rows={4} />
              </div>
              <div>
                <Label>About Me (EN)</Label>
                <Textarea
                  rows={4}
                  value={formData.about_me}
                  onChange={(e) =>
                    setFormData({ ...formData, about_me: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>About Me (JP)</Label>
                <Textarea
                  rows={4}
                  value={formData.about_me_jp}
                  onChange={(e) =>
                    setFormData({ ...formData, about_me_jp: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Education (EN – JSON)</Label>
                <Textarea
                  rows={8}
                  className="font-mono text-sm"
                  value={formData.education}
                  onChange={(e) =>
                    setFormData({ ...formData, education: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Education (JP – JSON)</Label>
                <Textarea
                  rows={8}
                  className="font-mono text-sm"
                  value={formData.education_jp}
                  onChange={(e) =>
                    setFormData({ ...formData, education_jp: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Experience (EN – JSON)</Label>
                <Textarea
                  rows={8}
                  className="font-mono text-sm"
                  value={formData.experience}
                  onChange={(e) =>
                    setFormData({ ...formData, experience: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Experience (JP – JSON)</Label>
                <Textarea
                  rows={8}
                  className="font-mono text-sm"
                  value={formData.experience_jp}
                  onChange={(e) =>
                    setFormData({ ...formData, experience_jp: e.target.value })
                  }
                />
              </div>


              <div>
                <Label>Avatar URL</Label>
                <Input value={formData.avatar_url} onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Resume URL (EN)</Label>
                  <Input value={formData.resume_url_en} onChange={(e) => setFormData({ ...formData, resume_url_en: e.target.value })} />
                </div>
                <div>
                  <Label>Resume URL (JP)</Label>
                  <Input value={formData.resume_url_jp} onChange={(e) => setFormData({ ...formData, resume_url_jp: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div>
                  <Label>GitHub URL</Label>
                  <Input value={formData.github} onChange={(e) => setFormData({ ...formData, github: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>LinkedIn URL</Label>
                  <Input value={formData.linkedin} onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })} />
                </div>
                <div>
                  <Label>Twitter URL</Label>
                  <Input value={formData.twitter} onChange={(e) => setFormData({ ...formData, twitter: e.target.value })} />
                </div>
              </div>

              <Button onClick={handleSave}>Save Profile</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
