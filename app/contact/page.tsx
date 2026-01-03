'use client';

import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, Github, Linkedin, Instagram } from 'lucide-react';

export default function Contact() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            {t('Get in Touch', 'お問い合わせ')}
          </h1>
          <p className="text-xl text-gray-600 mb-16 max-w-2xl mx-auto">
            {t(
              "I'm always open to discussing new projects, research opportunities, or potential collaborations.",
              '新しいプロジェクト、研究の機会、または潜在的なコラボレーションについて、いつでもご相談をお受けします。'
            )}
          </p>

          <div className="bg-white border border-gray-200 rounded-xl p-12">
            <div className="flex flex-col items-center space-y-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="w-10 h-10 text-blue-600" />
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {t('Email Me', 'メールを送る')}
                </h2>
                <a
                  href="mailto:saibharadwaja18@gmail.com"
                  className="text-blue-600 hover:text-blue-700 text-lg transition-colors"
                >
                  saibharadwaja18@gmail.com
                </a>
              </div>

              <div className="pt-8 border-t border-gray-200 w-full">
                <p className="text-gray-600 mb-6 text-center">
                  {t('Or connect with me on:', 'または以下でつながりましょう:')}
                </p>
                <div className="flex justify-center space-x-6">
                  <a
                    href="https://github.com/SaiBharadwaja-18"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <Github className="w-6 h-6 text-gray-700" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/bharadwaja-ummethala-169222259/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <Linkedin className="w-6 h-6 text-gray-700" />
                  </a>
                  <a
                    href="https://www.instagram.com/sai_bharadwaja"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <Instagram className="w-6 h-6 text-gray-700" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
