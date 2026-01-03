'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Globe, Moon, Sun } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();

  const links = [
    { href: '/', label: t('Home', 'ホーム') },
    { href: '/about', label: t('About', '概要') },
    { href: '/research', label: t('Research', '研究') },
    { href: '/projects', label: t('Projects', 'プロジェクト') },
    { href: '/skills', label: t('Skills', 'スキル') },
    { href: '/blog', label: t('Blog', 'ブログ') },
    { href: '/achievements', label: t('Achievements', '実績') },
    { href: '/certifications', label: t('Certifications', '認定') },
    { href: '/contact', label: t('Contact', '連絡') },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* LOGO (unchanged) */}
          <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <Image
              src="https://res.cloudinary.com/dvqg8tcmh/image/upload/v1767355213/light_mode_qqrjkc.png"
              alt="SB Logo"
              width={121}
              height={121}
              className="block dark:hidden"
              priority
            />
            <Image
              src="https://res.cloudinary.com/dvqg8tcmh/image/upload/v1767355214/dark_mode_uni9kb.png"
              alt="SB Logo"
              width={95}
              height={95}
              className="hidden dark:block"
              priority
            />
          </Link>

          {/* DESKTOP NAV — UNCHANGED */}
          <div className="hidden md:flex items-center space-x-6">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setLanguage(language === 'en' ? 'jp' : 'en')}
              className="flex items-center space-x-1 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>{language === 'en' ? '日本語' : 'EN'}</span>
            </button>
          </div>

          {/* MOBILE CONTROLS */}
          <div className="md:hidden flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-gray-700 dark:text-gray-300"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Language toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'jp' : 'en')}
              className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              <Globe className="w-4 h-4" />
              <span>{language === 'en' ? 'JP' : 'EN'}</span>
            </button>

            {/* Menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 dark:text-gray-300"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU (links only now) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800"
          >
            <div className="px-4 pt-2 pb-4 space-y-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block py-2 text-base font-medium ${
                    pathname === link.href
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
