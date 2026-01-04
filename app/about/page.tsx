'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';

export default function About() {
  const { language, t } = useLanguage();

  const [profile, setProfile] = useState<Database['profile'] | null>(null);
  const [skills, setSkills] = useState<Database['skills'][]>([]);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const { data: profileData } = await supabase.from('profile').select('*').maybeSingle();
      const { data: skillsData } = await supabase
        .from('skills')
        .select('*')
        .order('category', { ascending: true })
        .order('order_index', { ascending: true });

      if (profileData) setProfile(profileData);
      if (skillsData) setSkills(skillsData);
    }
    fetchData();
  }, []);

  useEffect(() => {
    function esc(e: KeyboardEvent) {
      if (e.key === 'Escape') setResumeUrl(null);
    }
    if (resumeUrl) window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [resumeUrl]);

  if (!profile) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading…</div>;
  }

  const education =
  language === 'jp' && profile?.education_jp
    ? profile.education_jp
    : profile?.education;

const experience =
  language === 'jp' && profile?.experience_jp
    ? profile.experience_jp
    : profile?.experience;


  const groupedSkills = skills.reduce((acc, s) => {
    acc[s.category] = acc[s.category] || [];
    acc[s.category].push(s);
    return acc;
  }, {} as Record<string, Database['skills'][]>);

  return (
    <div className="min-h-screen py-24 bg-white dark:bg-gray-950">
      <div className="max-w-5xl mx-auto px-4 space-y-24">

        {/* ABOUT */}
        <section>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            {t('About Me', '私について')}
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed text-justify whitespace-pre-line">
            {language === 'jp' && profile.about_me_jp ? profile.about_me_jp : profile.about_me}
          </p>
        </section>

        {/* RESUME */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
            {t('Resume', '履歴書')}
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            {profile.resume_url_en && (
              <motion.button
                whileHover={{ y: -3 }}
                onClick={() => setResumeUrl(profile.resume_url_en!)}
                className="border-l-4 border-blue-600 dark:border-blue-400 rounded-xl bg-slate-50 dark:bg-gray-900 p-6 text-left shadow-sm hover:shadow-md transition"
              >
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">Resume (English)</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View or download</p>
                <p className="text-xs text-gray-400 mt-3">
                  Last updated: {new Date(profile.updated_at).toLocaleDateString()}
                </p>
              </motion.button>
            )}

            {profile.resume_url_jp && (
              <motion.button
                whileHover={{ y: -3 }}
                onClick={() => setResumeUrl(profile.resume_url_jp!)}
                className="border-l-4 border-indigo-600 dark:border-indigo-400 rounded-xl bg-slate-50 dark:bg-gray-900 p-6 text-left shadow-sm hover:shadow-md transition"
              >
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">履歴書（日本語）</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">表示・ダウンロード</p>
                <p className="text-xs text-gray-400 mt-3">
                  最終更新日：{new Date(profile.updated_at).toLocaleDateString()}
                </p>
              </motion.button>
            )}
          </div>
        </section>

        {/* EDUCATION */}
{/* EDUCATION */}
{education?.length > 0 && (
  <section>
    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-12">
      {t('Education', '学歴')}
    </h2>

    <div className="grid sm:grid-cols-2 gap-8">
      {education.map((e: any, i: number) => (
        <div
          key={i}
          className="border border-teal-200 dark:border-teal-400/30 rounded-xl p-6 bg-white dark:bg-gray-900"
        >
          {/* Institution */}
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {e.institution}
          </h3>

          {/* Degree */}
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            {e.degree}
          </p>

          {/* Duration */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {e.start_year} – {e.end_year}
          </p>

          {/* Grade */}
          {e.grade && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {t('Grade', '成績')}: {e.grade}
            </p>
          )}

          {/* ✅ SPECIALIZATION (SRM) */}
          {e.specialization && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('Specialization', '専門分野')}
              </p>
              <span className="text-xs px-3 py-1 rounded-full
                      bg-teal-50 text-teal-700
                      dark:bg-teal-400/10 dark:text-teal-300">
                {e.specialization}
              </span>
            </div>
          )}

          {/* ✅ ELECTIVES (IIT) */}
          {Array.isArray(e.electives) && e.electives.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('Electives', '選択科目')}
              </p>

              <div className="flex flex-wrap gap-2">
                {e.electives.map((el: string, idx: number) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1 rounded-full
                      bg-teal-50 text-teal-700
                      dark:bg-teal-400/10 dark:text-teal-300"
                  >
                    {el}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  </section>
)}



        {/* EXPERIENCE */}
        {experience?.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-12">
              {t('Experience', '経験')}
            </h2>

            <div className="space-y-10">
              {experience.map((exp: any, i: number) => (
                <div
                  key={i}
                  className="border-l-4 border-purple-600 dark:border-purple-400 pl-6"
                >
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{exp.role}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {exp.organization} • {exp.duration}
                  </p>
                  <p className="mt-3 text-gray-700 dark:text-gray-300 text-justify">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* MODAL */}
      {resumeUrl && (
        <div
          className="fixed inset-0 z-50 backdrop-blur-md bg-black/30 flex items-center justify-center px-4"
          onClick={() => setResumeUrl(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-900 w-full max-w-4xl h-[85vh] rounded-xl overflow-hidden shadow-xl relative"
          >
            <div className="absolute top-3 right-3 flex gap-3 z-10">
              <span className="text-xs text-gray-400 hidden sm:block">ESC to close</span>
              <a href={resumeUrl} download className="px-3 py-1 text-sm bg-gray-900 text-white rounded-md">
                Download
              </a>
              <button onClick={() => setResumeUrl(null)} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-md">
                ✕
              </button>
            </div>
            <iframe src={resumeUrl} className="w-full h-full" />
          </div>
        </div>
      )}
    </div>
  );
}
