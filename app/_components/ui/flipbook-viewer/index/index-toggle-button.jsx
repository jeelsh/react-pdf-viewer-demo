'use client';
import React from 'react';
import { BookOpen, Menu } from 'lucide-react';
import { cn } from '@/app/_lib/utils';

const IndexToggleButton = ({ isIndexVisible, onToggle, className }) => {
  return (
    <button
      onClick={onToggle}
      className={cn(
        "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors rounded-md",
        "hover:bg-muted hover:text-foreground",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        isIndexVisible 
          ? "bg-primary text-primary-foreground hover:bg-primary/90" 
          : "bg-background text-muted-foreground",
        className
      )}
      aria-label={isIndexVisible ? "Ocultar índice" : "Mostrar índice"}
      title={isIndexVisible ? "Ocultar índice" : "Mostrar índice"}
    >
      <BookOpen className="h-4 w-4" />
      <span className="hidden sm:inline">Índice</span>
    </button>
  );
};

export default IndexToggleButton;
