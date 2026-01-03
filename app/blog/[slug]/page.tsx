'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';
import { format } from 'date-fns';
import { useParams } from 'next/navigation';
import MasonryGrid from '@/components/MasonryGrid';
import AudioPlayer from '@/components/AudioPlayer';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function BlogPost() {
  const { language, t } = useLanguage();
  const params = useParams();
  const slug = params.slug as string;
  const [blog, setBlog] = useState<Database['blogs'] | null>(null);

  useEffect(() => {
    async function fetchBlog() {
      const { data } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();

      if (data) setBlog(data);
    }

    fetchBlog();
  }, [slug]);

  if (!blog) {
    return (
      <div className="min-h-screen py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-500 dark:text-gray-400 text-center py-16 text-lg animate-pulse">
              {t('Loading…', '読み込み中…')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('Back to Blog', 'ブログに戻る')}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <span className="px-3 py-1 bg-blue-100 text-blue-600 text-sm font-medium rounded-full">
                {blog.category}
              </span>
              <span className="text-gray-500">
                {format(new Date(blog.publish_date), 'MMMM d, yyyy')}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              {language === 'jp' && blog.title_jp ? blog.title_jp : blog.title}
            </h1>

            <AudioPlayer audioUrl={blog.audio_url} />
          </div>

          <div className="prose prose-lg max-w-none mb-12 text-justify whitespace-pre-line">
            <ReactMarkdown>
              {language === 'jp' && blog.content_jp ? blog.content_jp : blog.content}
            </ReactMarkdown>
          </div>

          {blog.images && blog.images.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {t('Images', '画像')}
              </h2>
              <MasonryGrid
                images={blog.images}
                alt={language === 'jp' && blog.title_jp ? blog.title_jp : blog.title}
              />
            </div>
          )}
        </motion.div>
      </article>
    </div>
  );
}
