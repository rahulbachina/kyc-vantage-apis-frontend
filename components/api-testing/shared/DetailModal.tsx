"use client"

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import styles from '../styles/glassmorphism.module.css';

interface DetailModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function DetailModal({ open, onClose, title, children }: DetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[1200px] max-h-[90vh] overflow-hidden p-0 bg-[rgba(20,20,25,0.95)] border-[rgba(255,255,255,0.1)] backdrop-blur-[20px]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-[rgba(255,255,255,0.1)] bg-[rgba(10,10,15,0.5)]">
          <DialogTitle className="text-2xl font-bold text-white">
            {title}
          </DialogTitle>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-colors"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
