'use client';
import React, { useState } from 'react';
import { ChevronRight, ChevronDown, FileText, BookOpen } from 'lucide-react';
import { cn } from '@/app/_lib/utils';

const TableOfContents = ({ isVisible, onToggle, onPageSelect, currentPage }) => {
  const [expandedSections, setExpandedSections] = useState({
    introduction: true,
    chapter1: false,
    chapter2: false,
    conclusion: false,
  });

  // Datos de ejemplo para el índice
  const tableOfContents = [
    {
      id: 'introduction',
      title: 'Introducción',
      page: 1,
      children: [
        { id: 'intro-1', title: 'Introducción del documento', page: 1 },
      ]
    },
    {
      id: 'chapter1',
      title: 'Capítulo 1',
      page: 2,
      children: [
        { id: 'ch1-1', title: 'Capítulo 1 - intro', page: 2 },
      ]
    },
    {
      id: 'chapter2',
      title: 'Capítulo 2: Desarrollo',
      page: 4,
      children: [
        { id: 'ch2-1', title: 'Análisis de requisitos', page: 4 },
      ]
    }
  ];

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handlePageClick = (pageNumber) => {
    onPageSelect(pageNumber - 1); // Convert to 0-based index
  };

  if (!isVisible) return null;

  return (
    <div className="absolute left-0 top-0 h-full w-80 bg-background border-r border-border shadow-lg z-10 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-foreground">Índice</h2>
        </div>
        <button
          onClick={onToggle}
          className="p-1 hover:bg-muted rounded"
          aria-label="Cerrar índice"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-2">
        <nav className="space-y-1">
          {tableOfContents.map((section) => (
            <div key={section.id}>
              {/* Section header */}
              <button
                onClick={() => toggleSection(section.id)}
                className={cn(
                  "w-full flex items-center justify-between p-2 text-left hover:bg-muted rounded-md transition-colors",
                  currentPage >= section.page - 1 && "bg-muted/50"
                )}
              >
                <div className="flex items-center gap-2 flex-1">
                  <div className="flex items-center">
                    {section.children ? (
                      expandedSections[section.id] ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )
                    ) : (
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {section.title}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePageClick(section.page);
                  }}
                  className="text-xs text-muted-foreground hover:text-primary px-2 py-1 rounded hover:bg-primary/10 transition-colors"
                >
                  {section.page}
                </button>
              </button>

              {/* Children */}
              {section.children && expandedSections[section.id] && (
                <div className="ml-4 mt-1 space-y-1">
                  {section.children.map((child) => (
                    <button
                      key={child.id}
                      onClick={() => handlePageClick(child.page)}
                      className={cn(
                        "w-full flex items-center justify-between p-2 text-left hover:bg-muted rounded-md transition-colors",
                        currentPage === child.page - 1 && "bg-primary/10 border-l-2 border-primary"
                      )}
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <FileText className="h-3 w-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {child.title}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground hover:text-primary px-1">
                        {child.page}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          Página {currentPage + 1} de {Math.max(...tableOfContents.flatMap(s => [s.page, ...(s.children?.map(c => c.page) || [])]))}
        </div>
      </div>
    </div>
  );
};

export default TableOfContents;
