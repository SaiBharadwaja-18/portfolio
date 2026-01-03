'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';
import { format } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';



export default function Blog() {
  const { language, t } = useLanguage();
  const [blogs, setBlogs] = useState<Database['blogs'][]>([]);

  useEffect(() => {
    async function fetchBlogs() {
      const { data } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
        .order('publish_date', { ascending: false });

      if (data) setBlogs(data);
    }

    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            {t('Blog', 'ブログ')}
          </h1>
          <p className="text-xl text-gray-600 mb-16 max-w-3xl">
            {t(
              'Thoughts, research insights, and stories from my journey.',
              '思考、研究の洞察、そして私の旅からの物語。'
            )}
          </p>
        </motion.div>

        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  href={`/blog/${blog.slug}`}
                  className="block bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {blog.images && blog.images.length > 0 && (
                    <div className="relative aspect-video">
                      <Image
                        src={blog.images[0]}
                        alt={language === 'jp' && blog.title_jp ? blog.title_jp : blog.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                 <div className="p-6">
  <div className="flex items-center space-x-3 mb-3">
    <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
      {blog.category}
    </span>
    <span className="text-sm text-gray-500">
      {format(new Date(blog.publish_date), 'MMM d, yyyy')}
    </span>
  </div>

  <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
    {language === 'jp' && blog.title_jp ? blog.title_jp : blog.title}
  </h2>

  <p className="text-gray-600 line-clamp-3 mb-4">
    {language === 'jp' && blog.content_jp
      ? blog.content_jp.slice(0, 150)
      : blog.content.slice(0, 150)}...
  </p>

  {/* READ MORE */}
 <div className="flex justify-end">
  <span className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
    {t('Read more', '続きを読む')}
  </span>
</div>


</div>

                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-16 text-lg animate-pulse">
    {t('Loading…', '読み込み中…')}
          </p>
        )}
      </div>
    </div>
  );
}
