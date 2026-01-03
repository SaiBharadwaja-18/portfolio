'use client';

import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';
import { ArrowRight, Sparkles, Calendar, Award, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import Loader from "@/components/Loader";

interface Highlight {
  id: string;
  title: string;
  title_jp?: string;
  description: string;
  description_jp?: string;
  image_url?: string;
  date: string;
}


export default function Home() {
  const { language, t } = useLanguage();
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [profile, setProfile] = useState<Database['profile'] | null>(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const fallbackScroll = useMotionValue(0);

  const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ["start start", "end end"],
});



  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const portraitY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const portraitScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);

  const smoothHeroY = useSpring(heroY, { stiffness: 100, damping: 30 });
  const smoothPortraitY = useSpring(portraitY, { stiffness: 100, damping: 30 });
  

  useEffect(() => {
    async function fetchData() {
      const [achievementsRes, conferencesRes, researchRes, profileRes] = await Promise.all([
        supabase.from('achievements').select('*').order('date', { ascending: false }).limit(3),
        supabase.from('conferences').select('*').order('date', { ascending: false }).limit(2),
        supabase.from('research').select('*').order('date', { ascending: false }).limit(2),
        supabase.from('profile').select('*').maybeSingle(),
      ]);

      const highlightsRes = await supabase
      .from('highlights')
      .select('*')
      .order('date', { ascending: false })
      .limit(3); // homepage highlights

      if (highlightsRes.error) {
        console.error('Highlights fetch error:', highlightsRes.error);
      } else {
        setHighlights(highlightsRes.data || []);
      }

      if (profileRes.data) setProfile(profileRes.data);
      setLoading(false);
    }

    fetchData();
  }, []);
  

  return (
    <div ref={containerRef} className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Loader show={loading} />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-white to-gray-50/50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-950/20" />

        <motion.div
          style={{ y: smoothHeroY, opacity: heroOpacity }}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100/50 dark:bg-blue-900/30 rounded-full"
              >
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {t('Quietly Building', '静かに築く')}
                </span>
              </motion.div>

              <div>
                <h1 className="font-bold text-gray-900 dark:text-white mb-6 leading-tight whitespace-nowrap text-[clamp(2.6rem,6vw,4.5rem)]">
                {language === 'jp'
                  ? profile?.name_jp || profile?.name
                  : profile?.name || profile?.name_jp}
                </h1>

                <p className="text-2xl sm:text-3xl text-gray-600 dark:text-gray-300 font-light mb-6">
                  {language === 'jp' && profile?.tagline_jp
                    ? profile.tagline_jp
                    : profile?.tagline || t('Researcher | Developer | Innovator', '研究者 | 開発者 | イノベーター')}
                </p>
                <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-xl">
                  {language === 'jp' && profile?.bio_jp
                    ? profile.bio_jp
                    : profile?.bio || t(
                        'Passionate about creating innovative solutions through research and technology.',
                        '研究と技術を通じて革新的なソリューションを創造することに情熱を注いでいます。'
                      )}
                </p>
              </div>
              

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  href="/projects"
                  className="group inline-flex items-center justify-center px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-all"
                >
                  {t('Explore Work', '作品を見る')}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white rounded-lg hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900 transition-all"
                >
                  {t('Get in Touch', 'お問い合わせ')}
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              style={{ y: smoothPortraitY, scale: portraitScale }}
              className="relative lg:h-[600px] h-[400px] hidden lg:block"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 1 }}
                className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 dark:from-blue-600/20 dark:to-purple-600/20 rounded-full blur-3xl"
              />

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 1 }}
                className="relative h-full flex items-center justify-center"
              >
                <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-100 to-gray-100 dark:from-blue-900/50 dark:to-gray-800/50" />
                  <div className="absolute inset-8 rounded-full border-2 border-gray-200 dark:border-gray-700" />
                  {profile?.avatar_url && (
                    <img
                      src={profile.avatar_url}
                      alt={profile.name}
                      className="absolute inset-0 w-full h-full object-cover rounded-full mix-blend-multiply dark:mix-blend-lighten opacity-90"
                    />
                  )}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex flex-col items-center space-y-2 text-gray-400 dark:text-gray-500"
          >
            <span className="text-sm font-medium">{t('Scroll to explore', '下にスクロール')}</span>
            <div className="w-0.5 h-12 bg-gradient-to-b from-gray-400 to-transparent dark:from-gray-600" />
          </motion.div>
        </motion.div>
      </section>

      <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-20 text-center"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {t('Recent Highlights', '最近のハイライト')}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {t('Moments that define the journey', '旅を形作る瞬間')}
            </p>
          </motion.div>

          {highlights.length > 0 ? (
    <div className="space-y-28">
      {highlights.map((highlight, index) => (
        <motion.div
          key={highlight.id}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: index * 0.1 }}
          viewport={{ once: true, margin: "-50px" }}
          className={`flex flex-col ${
            index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
          } gap-14 items-center`}
        >
          {/* IMAGE */}
          {highlight.image_url && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="w-full lg:w-[420px] overflow-hidden rounded-2xl shadow-lg"
            >
              <img
                src={highlight.image_url}
                alt={highlight.title}
                className="w-full h-[260px] object-cover"
              />
              </motion.div>
              )}

          {/* TEXT */}
          <div className="flex-1 space-y-5">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {format(new Date(highlight.date), 'MMMM yyyy')}
            </span>

            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {language === 'jp' && highlight.title_jp
                ? highlight.title_jp
                : highlight.title}
            </h3>

            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed text-justify whitespace-pre-line">
              {language === 'jp' && highlight.description_jp
                ? highlight.description_jp
                : highlight.description}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  ) : (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="text-center py-12"
    >
      <p className="text-gray-500 dark:text-gray-400">
        {t(
          'More highlights coming soon...',
          'より多くのハイライトが近日公開されます...'
        )}
      </p>
    </motion.div>
  )}


          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-24 text-center"
          >
            <Link
              href="/achievements"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-lg group"
            >
              {t('View all achievements', 'すべての実績を見る')}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="relative py-32 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t('Explore More', 'さらに探索')}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: t('Research', '研究'),
                description: t('Publications and academic work', '出版物と学術研究'),
                href: '/research',
                color: 'from-blue-600 to-cyan-600',
              },
              {
                title: t('Projects', 'プロジェクト'),
                description: t('Technical creations and experiments', '技術的創造と実験'),
                href: '/projects',
                color: 'from-purple-600 to-pink-600',
              },
              {
                title: t('Skills', 'スキル'),
                description: t('Technical strengths and expertise', '技術力と専門性'),
                href: '/skills',
                color: 'from-orange-600 to-red-600',
              },

            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  href={item.href}
                  className="group block p-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                >
                  <div className={`w-12 h-1 bg-gradient-to-r ${item.color} rounded-full mb-6 group-hover:w-16 transition-all`} />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {item.description}
                  </p>
                  <span className="inline-flex items-center text-gray-900 dark:text-white font-medium group-hover:translate-x-2 transition-transform">
                    {t('Explore', '探索')}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
