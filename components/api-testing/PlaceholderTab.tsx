"use client"

import { LucideIcon } from 'lucide-react';
import styles from './styles/glassmorphism.module.css';

interface PlaceholderTabProps {
  name: string;
  description: string;
  icon?: LucideIcon;
}

export function PlaceholderTab({ name, description, icon: Icon }: PlaceholderTabProps) {
  return (
    <div className={`${styles.glass} p-12`}>
      <div className="text-center max-w-2xl mx-auto">
        {Icon && (
          <div className="inline-flex p-6 rounded-2xl bg-[rgba(0,210,255,0.1)] mb-6">
            <Icon size={64} className="text-cyan-400 opacity-50" />
          </div>
        )}
        <h2 className="text-3xl font-bold mb-4 text-white">{name}</h2>
        <p className="text-lg text-gray-400 mb-8">{description}</p>
        <div className={`${styles.glass} p-6 inline-block`}>
          <p className="text-sm text-gray-500">
            Integration coming soon. Stay tuned for updates.
          </p>
        </div>
      </div>
    </div>
  );
}
