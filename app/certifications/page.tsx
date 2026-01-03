'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/lib/supabase';
import { format } from 'date-fns';
import { Download, X } from 'lucide-react';

type CertRow = Database['certifications'];

export default function Certifications() {
  const { language, t } = useLanguage();
  const [certifications, setCertifications] = useState<CertRow[]>([]);
  const [openPdfUrl, setOpenPdfUrl] = useState<string | null>(null);
  const [openPdfTitle, setOpenPdfTitle] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCertifications() {
      const { data } = await supabase
        .from('certifications')
        .select('*')
        .order('date', { ascending: false });

      if (data) setCertifications(data as CertRow[]);
    }

    fetchCertifications();
  }, []);

  const handleOpenPdf = (url: string, title: string) => {
    setOpenPdfUrl(url);
    setOpenPdfTitle(title);
  };

  const handleClosePdf = () => {
    setOpenPdfUrl(null);
    setOpenPdfTitle(null);
  };

  return (
    <section className="min-h-screen py-24 bg-white dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER (same style as Projects) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            {t('Certifications & Documents', '認定と書類')}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
            {t(
              'Academic certifications and professional recognitions',
              '学術認定および専門的な実績'
            )}
          </p>
        </motion.div>

        {/* CONTENT (unchanged layout, side image + text, modal, etc.) */}
        {certifications.length > 0 ? (
          <div className="space-y-28">
            {certifications.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true, margin: '-50px' }}
                className={`flex flex-col ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                } gap-14 items-center`}
              >
                {/* IMAGE CARD (no extra border, works for portrait + landscape) */}
                {cert.images?.length > 0 && (
                  <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="
                      w-full lg:w-[420px]
                      rounded-3xl
                      bg-gray-100 dark:bg-gray-900
                      shadow-md
                      overflow-hidden
                      flex items-center justify-center
                      px-3 py-3
                    "
                  >
                    <img
                      src={cert.images[0]}
                      alt={cert.title}
                      className="
                        max-w-full max-h-[360px]
                        object-contain
                        rounded-2xl
                      "
                    />
                  </motion.div>
                )}

                {/* TEXT */}
                <div className="flex-1 space-y-5">
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    {format(new Date(cert.date), 'MMMM yyyy')}
                  </span>

                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    {language === 'jp' && cert.title_jp
                      ? cert.title_jp
                      : cert.title}
                  </h3>

                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed text-justify whitespace-pre-line">
                    {language === 'jp' && cert.description_jp
                      ? cert.description_jp
                      : cert.description}
                  </p>

                  {cert.download_url && (
                    <button
                      type="button"
                      onClick={() => handleOpenPdf(cert.download_url!, cert.title)}
                      className="
                        inline-flex items-center gap-2
                        text-sm font-medium
                        text-blue-600 dark:text-blue-400
                        hover:underline
                      "
                    >
                      <Download className="w-4 h-4" />
                      {t('View / Download', '表示・ダウンロード')}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-16 text-lg animate-pulse">
            {t('Loading…', '読み込み中…')}
          </p>
        )}
      </div>

      {/* PDF MODAL (unchanged) */}
      {openPdfUrl && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={handleClosePdf}
          />

          <div
            className="
              relative z-50
              w-[95vw] h-[80vh]
              sm:w-[90vw] sm:h-[85vh]
              max-w-4xl
              bg-white dark:bg-gray-900
              rounded-2xl
              shadow-2xl
              flex flex-col
              overflow-hidden
            "
          >
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-200 dark:border-gray-700">
              <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
                {openPdfTitle}
              </h4>
              <div className="flex items-center gap-3">
                <a
                  href={openPdfUrl}
                  download
                  className="
                    inline-flex items-center gap-2
                    text-xs sm:text-sm font-medium
                    text-blue-600 dark:text-blue-400
                    hover:underline
                  "
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </a>
                <button
                  type="button"
                  onClick={handleClosePdf}
                  className="
                    p-1.5 rounded-full
                    hover:bg-gray-100 dark:hover:bg-gray-800
                    text-gray-600 dark:text-gray-300
                  "
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-gray-100 dark:bg-gray-950">
              <iframe
                src={openPdfUrl}
                className="w-full h-full"
                title={openPdfTitle ?? 'Certificate PDF'}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
