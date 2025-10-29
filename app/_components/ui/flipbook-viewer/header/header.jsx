'use client';
import React from 'react';
import { FileText, Book } from 'lucide-react';
import IndexToggleButton from '../index/index-toggle-button';
import { cn } from '@/app/_lib/utils';

const Header = ({ 
  isIndexVisible, 
  onIndexToggle, 
  pdfDetails, 
  viewerStates, 
  documentTitle = "Documento PDF" 
}) => {
  const currentPage = viewerStates?.currentPageIndex + 1 || 1;
  const totalPages = pdfDetails?.totalPages || 0;

  return (
    <div className={cn(
      "w-full bg-background border-b border-border transition-all duration-300 ease-in-out",
      isIndexVisible ? "ml-80" : "ml-0"
    )}>
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left section - Index toggle and document info */}
        <div className="flex items-center gap-4">
          <IndexToggleButton 
            isIndexVisible={isIndexVisible} 
            onToggle={onIndexToggle} 
          />
          
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" />
            <div className="flex flex-col">
              <h1 className="text-sm font-medium text-foreground truncate max-w-[200px] sm:max-w-[300px]">
                {documentTitle}
              </h1>
              {totalPages > 0 && (
                <p className="text-xs text-muted-foreground">
                  Página {currentPage} de {totalPages}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right section - Document status/actions */}
        <div className="flex items-center gap-3">
          {totalPages > 0 && (
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <Book className="h-4 w-4" />
              <span>{totalPages} páginas</span>
            </div>
          )}
          
          {/* Progress indicator */}
          {totalPages > 0 && (
            <div className="hidden md:flex items-center gap-2">
              <div className="w-24 h-1 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${(currentPage / totalPages) * 100}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground min-w-[3rem]">
                {Math.round((currentPage / totalPages) * 100)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;