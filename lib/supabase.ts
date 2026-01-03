import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  blogs: {
    id: string;
    title: string;
    title_jp?: string;
    slug: string;
    category: string;
    content: string;
    content_jp?: string;
    images: string[];
    audio_url?: string;
    publish_date: string;
    status: 'draft' | 'published';
    created_at: string;
    updated_at: string;
  };
  projects: {
    id: string;
    title: string;
    title_jp?: string;
    description: string;
    description_jp?: string;
    images: string[];
    tech_stack: string[];
    project_link?: string;
    github_link?: string;
    date: string;
    order_index: number;
    created_at: string;
    updated_at: string;
  };
  research: {
    id: string;
    title: string;
    title_jp?: string;
    description: string;
    description_jp?: string;
    content?: string;
    content_jp?: string;
    images: string[];
    date: string;
    created_at: string;
    updated_at: string;
  };
  achievements: {
    id: string;
    title: string;
    title_jp?: string;
    description: string;
    description_jp?: string;
    date: string;
    image?: string;
    created_at: string;
    updated_at: string;
  };
  conferences: {
    id: string;
    title: string;
    title_jp?: string;
    description: string;
    description_jp?: string;
    date: string;
    location?: string;
    images: string[];
    created_at: string;
    updated_at: string;
  };
  certifications: {
    id: string;
    title: string;
    title_jp?: string;
    description: string;
    description_jp?: string;
    images: string[];
    type: 'certificate' | 'lor' | 'other';
    date: string;
    download_url?: string;
    created_at: string;
    updated_at: string;
  };
  skills: {
    id: string;
    name: string;
    name_jp?: string;
    category: string;
    proficiency: number;
    order_index: number;
    created_at: string;
    updated_at: string;
  };
  profile: {
    id: string;
    name: string;
    name_jp?: string;
    tagline?: string;
    tagline_jp?: string;
    bio?: string;
    bio_jp?: string;
    avatar_url?: string;
    resume_url_en?: string;
    resume_url_jp?: string;
    email?: string;
    github?: string;
    linkedin?: string;
    twitter?: string;
    updated_at: string;
  };
};
