"use client"

import { Loader2 } from 'lucide-react';
import styles from '../styles/glassmorphism.module.css';

export function LoadingSpinner({ size = 48 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="animate-spin text-cyan-400" size={size} />
    </div>
  );
}

export function SearchResultsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className={`${styles.glass} p-6 animate-pulse`}>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 bg-gray-700 rounded-xl"></div>
            <div className="w-20 h-4 bg-gray-700 rounded"></div>
          </div>
          <div className="h-6 bg-gray-700 rounded mb-3 w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-700 rounded w-2/3"></div>
          </div>
          <div className="h-10 bg-gray-700 rounded mt-4"></div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className={styles.emptyState}>
      <Icon size={64} className="opacity-50" />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
