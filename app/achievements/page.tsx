'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';
import { format } from 'date-fns';
import Image from 'next/image';
import { Award } from 'lucide-react';

export default function Achievements() {
  const { language, t } = useLanguage();
  const [achievements, setAchievements] = useState<Database['achievements'][]>([]);

  useEffect(() => {
    async function fetchAchievements() {
      const { data } = await supabase
        .from('achievements')
        .select('*')
        .order('date', { ascending: false });

      if (data) setAchievements(data);
    }

    fetchAchievements();
  }, []);

  return (
    <div className="min-h-screen py-28 bg-white dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-5">
            {t('Achievements', '実績')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
            {t(
              'Key recognitions, awards, and milestones across academics, research, and innovation.',
              '学業・研究・イノベーションにおける主な成果と受賞歴。'
            )}
          </p>
        </motion.div>

        {/* LIST */}
        <div className="space-y-16">
          {achievements.map((achievement, index) => (
            <motion.section
              key={achievement.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="grid grid-cols-[auto,1fr] gap-5 sm:gap-8"
            >
              {/* ICON COLUMN */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="mt-4 w-px flex-1 bg-gradient-to-b from-emerald-400/40 to-transparent" />
              </div>

              {/* CONTENT */}
              <div>
                <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-1">
                  {format(new Date(achievement.date), 'MMMM yyyy')}
                </p>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  {language === 'jp' && achievement.title_jp
                    ? achievement.title_jp
                    : achievement.title}
                </h3>

                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base text-justify whitespace-pre-line">
                  {language === 'jp' && achievement.description_jp
                    ? achievement.description_jp
                    : achievement.description}
                </p>

                {achievement.image && (
                  <div className="mt-4 max-w-sm rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800">
                    <Image
                      src={achievement.image}
                      alt={achievement.title}
                      width={400}
                      height={240}
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </motion.section>
          ))}
        </div>

        {/* EMPTY STATE */}
        {achievements.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-center py-16 text-lg animate-pulse">
            {t('Loading…', '読み込み中…')}
          </p>
        )}
      </div>
    </div>
  );
}
