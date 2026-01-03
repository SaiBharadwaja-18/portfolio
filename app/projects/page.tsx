'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';
import { ExternalLink, Github } from 'lucide-react';
import Image from 'next/image';

export default function Projects() {
  const { language, t } = useLanguage();
  const [projects, setProjects] = useState<Database['projects'][]>([]);

  useEffect(() => {
    async function fetchProjects() {
      const { data } = await supabase
        .from('projects')
        .select('*')
        // FIFO: oldest first
        .order('order_index', { ascending: true })
        .order('created_at', { ascending: true });

      if (data) setProjects(data);
    }

    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen py-24 bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            {t('Projects', 'プロジェクト')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
            {t(
              'Selected projects showcasing applied AI, full-stack development, and real-world problem solving.',
              'AI応用、フルスタック開発、実社会の課題解決に取り組んだプロジェクトを紹介します。'
            )}
          </p>
        </motion.div>

        {/* PROJECT GRID */}
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {projects.map((project, index) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:shadow-xl transition-all"
              >
                {/* IMAGE */}
                {project.images && project.images.length > 0 && (
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={project.images[0]}
                      alt={language === 'jp' && project.title_jp ? project.title_jp : project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {/* subtle overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  </div>
                )}

                {/* CONTENT */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 leading-snug">
                    {language === 'jp' && project.title_jp ? project.title_jp : project.title}
                  </h2>

                  <p className="text-gray-600 dark:text-gray-300 mb-5 leading-relaxed text-justify">
                    {language === 'jp' && project.description_jp
                      ? project.description_jp
                      : project.description}
                  </p>

                  {/* TECH STACK */}
                  {project.tech_stack && project.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tech_stack.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 text-xs rounded-full
                          bg-gray-100 text-gray-700
                          dark:bg-gray-800 dark:text-gray-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* LINKS */}
                  <div className="flex gap-5">
                    {project.project_link && (
                      <a
                        href={project.project_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        {t('View Project', 'プロジェクトを見る')}
                      </a>
                    )}

                    {project.github_link && (
                      <a
                        href={project.github_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      >
                        <Github className="w-4 h-4 mr-1" />
                        GitHub
                      </a>
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
