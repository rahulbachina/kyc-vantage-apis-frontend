"use client"

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface DetailModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function DetailModal({ open, onClose, title, children }: DetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[1200px] max-h-[90vh] overflow-hidden p-0">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b bg-muted/30">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {title}
          </DialogTitle>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto max-h-[calc(90vh-100px)] bg-white">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
