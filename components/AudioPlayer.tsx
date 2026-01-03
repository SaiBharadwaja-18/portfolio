'use client';

import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

interface AudioPlayerProps {
  audioUrl?: string;
}

export default function AudioPlayer({ audioUrl }: AudioPlayerProps) {
  const { t } = useLanguage();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const hasAudio = !!audioUrl;

  useEffect(() => {
    if (audioUrl) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }

    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [audioUrl]);

  const toggleAudio = async () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      await audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <button
      onClick={toggleAudio}
      disabled={!hasAudio}
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
        ${hasAudio
          ? 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400'
          : 'bg-gray-50 text-gray-400 cursor-not-allowed dark:bg-gray-800'}
      `}
    >
      <motion.div
        animate={isPlaying ? { scale: [1, 1.15, 1] } : {}}
        transition={{ duration: 1.2, repeat: isPlaying ? Infinity : 0 }}
      >
        {isPlaying ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </motion.div>

      <span className="text-sm font-medium">
        {hasAudio
          ? isPlaying
            ? t('Playing JP Audio', '日本語音声 再生中')
            : t('Play JP Audio', '日本語音声を再生')
          : t('JP Audio (Coming Soon)', '日本語音声（近日公開）')}
      </span>
    </button>
  );
}
