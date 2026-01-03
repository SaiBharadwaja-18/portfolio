'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';
import { format } from 'date-fns';
import Image from 'next/image';
import { FileText } from 'lucide-react';

export default function Research() {
  const { language, t } = useLanguage();
  const [research, setResearch] = useState<Database['research'][]>([]);

  useEffect(() => {
    async function fetchResearch() {
      const { data } = await supabase
        .from('research')
        .select('*')
        .order('date', { ascending: false });

      if (data) setResearch(data);
    }

    fetchResearch();
  }, []);

  return (
    <div className="min-h-screen py-24 bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            {t('Research & Publications', '研究と出版物')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
            {t(
              'Academic work focused on applied AI, data privacy, and real-world impact.',
              '応用AI、データプライバシー、実社会への応用に焦点を当てた研究活動。'
            )}
          </p>
        </motion.div>

        {/* PAPERS */}
        {research.length > 0 ? (
          <div className="space-y-20">
            {research.map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm"
              >
                {/* LEFT ACCENT LINE */}
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-teal-500 to-blue-600" />

                {/* IMAGE — MOBILE ONLY */}
                {item.image_url && (
                  <div className="px-6 pt-6 lg:hidden">
                    <div className="relative w-full aspect-[16/9] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                      <Image
                        src={item.image_url}
                        alt={language === 'jp' && item.title_jp ? item.title_jp : item.title}
                        fill
                        className="object-cover"
                        sizes="100vw"
                        priority={index === 0}
                      />
                    </div>
                  </div>
                )}

                {/* CONTENT */}
                <div className="p-6 sm:p-8">
                  {/* DATE + STATUS */}
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(item.date), 'MMMM yyyy')}
                    </span>

                    {item.status && (
                      <span className="px-3 py-1 text-xs rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300">
                        {item.status}
                      </span>
                    )}
                  </div>

                  {/* TITLE */}
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3 leading-snug">
                    {language === 'jp' && item.title_jp ? item.title_jp : item.title}
                  </h2>

                  {/* VENUE */}
                  {item.venue && (
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">
                      {language === 'jp' && item.venue_jp ? item.venue_jp : item.venue}
                    </p>
                  )}

                  {/* AUTHORS */}
                  {item.authors && item.authors.length > 0 && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {item.authors.join(', ')}
                    </p>
                  )}

                  {/* ABSTRACT */}
                  {item.abstract && (
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 text-justify">
                      {language === 'jp' && item.abstract_jp
                        ? item.abstract_jp
                        : item.abstract}
                    </p>
                  )}

                  {/* KEYWORDS */}
                  {item.keywords && item.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {item.keywords.map((key, i) => (
                        <span
                          key={i}
                          className="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 whitespace-nowrap"
                        >
                          {key}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* PAPER / PUBLICATION STATE */}
                  <div className="mt-2">
                    {item.status !== 'Accepted' && item.paper_link && (
                      <a
                        href={item.paper_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium hover:underline"
                      >
                        <FileText className="w-4 h-4" />
                        {t('View Paper', '論文を見る')}
                      </a>
                    )}

                    {item.status === 'Accepted' && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                        {t('Yet to be published', '出版予定')}
                      </p>
                    )}
                  </div>
                </div>
              </motion.article>
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
