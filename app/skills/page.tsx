'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Code2,
  Cpu,
  Brain,
  Layers3,
  Wrench,
} from 'lucide-react';

export default function Skills() {
  const { t } = useLanguage();

  const skillGroups = [
    {
      icon: Code2,
      titleEn: 'Programming Languages',
      titleJp: 'プログラミング言語',
      items: ['C', 'C++', 'Python', 'Java', 'JavaScript', 'TypeScript'],
    },
    {
      icon: Cpu,
      titleEn: 'Technologies',
      titleJp: '技術',
      items: [
        'Embedded Systems (Exposure)',
        'IoT',
        'TinyML',
        'Computer Vision',
      ],
    },
    {
      icon: Brain,
      titleEn: 'Domains',
      titleJp: '専門分野',
      items: [
        'AI & Machine Learning',
        'Web Development',
        'Software Engineering',
        'Hardware–Software Integration (Exposure)',
      ],
    },
    {
      icon: Layers3,
      titleEn: 'Frameworks & Tools',
      titleJp: 'フレームワーク・ツール',
      items: [
        'React',
        'Node.js',
        'Express.js',
        'MongoDB',
        'Supabase',
        'Git & GitHub',
      ],
    },
    {
      icon: Wrench,
      titleEn: 'Work Style',
      titleJp: '仕事の姿勢',
      items: [
        'Problem Solving',
        'Team Collaboration',
        'Fast Learner',
        'Research-Oriented Thinking',
        'Documentation',
      ],
    },
  ];

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
            {t('Skills & Expertise', 'スキルと専門性')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
            {t(
              'A structured overview of my technical capabilities and working approach.',
              '私の技術力と仕事への取り組み方を整理して紹介します。'
            )}
          </p>
        </motion.div>

        {/* CONTENT */}
        <div className="space-y-20">
          {skillGroups.map((group, index) => (
            <motion.section
              key={index}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              className="grid grid-cols-[auto,1fr] gap-6 sm:gap-10"
            >
              {/* LEFT ICON COLUMN */}
              <div className="flex flex-col items-center">
                <group.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <div className="mt-3 w-px flex-1 bg-gradient-to-b from-blue-400/40 to-transparent" />
              </div>

              {/* RIGHT CONTENT */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  {t(group.titleEn, group.titleJp)}
                </h2>

                <div className="flex flex-wrap gap-3">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="
                        px-4 py-1.5
                        text-sm
                        rounded-full
                        border border-gray-300
                        text-gray-700
                        dark:border-gray-700 dark:text-gray-300
                        bg-transparent
                        whitespace-nowrap
                      "
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  );
}
