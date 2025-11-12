'use client';
import React, { useState } from 'react';
import { ChevronRight, ChevronDown, FileText, BookOpen } from 'lucide-react';
import { cn } from '@/app/_lib/utils';
import useScreenSize from '@/app/_hooks/use-screensize';

const TableOfContents = ({ isVisible, onToggle, onPageSelect, currentPage, items }) => {
  const { width: screenWidth } = useScreenSize();
  const isMobile = screenWidth < 768; // md breakpoint
  const [expandedSections, setExpandedSections] = useState({
    introduction: true,
    chapter1: false,
    chapter2: false,
    salsaClasica: true,
    concentradoTomate: true,
    salsaBolognesa: true,
    salsaCasera: true,
    conclusion: false,
  });

  // Datos de ejemplo para el índice (fallback si no hay items dinámicos)
  const tableOfContents = [
    {
    "totalPages": 8,
    "items": [
          {
            "id": "page_1",
            "title": "Pomarola 60 Recetas",
            "page": 1,
            "children": []
          },
          {
              "id": "page_2",
              "title": "Salsas Base",
              "page": 2,
              "children": [
                  {
                      "id": "page_2_salsa_clasica",
                      "title": "Salsa Clásica",
                      "page": 2,
                      "children": []
                  },
                  {
                      "id": "page_2_centrado_tomate",
                      "title": "Con Centrado de Tomate",
                      "page": 2,
                      "children": []
                  }
              ]
          },
          {
              "id": "page_3",
              "title": "Salsas Listas",
              "page": 3,
              "children": [
                  {
                      "id": "page_3_salsa_casera",
                      "title": "Salsa Casera",
                      "page": 3,
                      "children": []
                  },
                  {
                      "id": "page_3_salsa_bolognesa",
                      "title": "Salsa Bolognesa",
                      "page": 3,
                      "children": []
                  }
              ]
          },
          {
              "id": "page_4",
              "title": "Recetas Salsa Clásica",
              "page": 4,
              "children": []
          },
          {
              "id": "page_5",
              "title": "Recetas Concentrado Tomate",
              "page": 5,
              "children": []
          },
          {
              "id": "page_6",
              "title": "Recetas Salsa Bolognesa",
              "page": 6,
              "children": []
          },
          {
              "id": "page_7",
              "title": "Recetas Salsa Casera",
              "page": 7,
              "children": []
          },
          {
              "id": "page_8",
              "title": "Ñoquis con Salsa Vegetariana",
              "page": 8,
              "children": []
          }
        ]
    }
  ];

  const toggleSection = (sectionId) => {
    // Only one section open at a time.
    // If the clicked section is currently closed -> open it and close all others.
    // If it's currently open -> close it (result: no open sections).
    setExpandedSections(prev => {
      const willOpen = !prev[sectionId];
      if (willOpen) return { [sectionId]: true };
      return {};
    });
  };

  const handlePageClick = (pageNumber) => {
    onPageSelect(pageNumber - 1); // Convert to 0-based index
    // Auto-close index on mobile after selection
    if (isMobile) {
      onToggle();
    }
  };

  // Usa items dinámicos si están disponibles, de lo contrario usa el fallback
  const toc = Array.isArray(items) && items.length > 0 ? items : tableOfContents;

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay for mobile/tablet */}
      {(isMobile || screenWidth < 1024) && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onToggle}
          aria-label="Cerrar índice"
        />
      )}
      
      <div className={cn(
        "left-0 top-0 h-full w-80 bg-background border-r border-border shadow-lg z-50 flex flex-col",
        isMobile || screenWidth < 1024 
          ? "fixed" // Use fixed positioning on mobile and tablet to avoid pushing other elements
          : "absolute" // Use absolute positioning on desktop
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-foreground">Índice</h2>
        </div>
        <button
          onClick={onToggle}
          className="size-8 min-w-8 flex items-center justify-center hover:bg-white/10 rounded-full transition-all"
          aria-label="Cerrar índice"
        >
          <ChevronRight className="h-5 w-5 text-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-2">
        <nav className="space-y-1">
          {toc.map((section) => {
            const hasChildren = Array.isArray(section.children) && section.children.length > 0;
            const isExpanded = !!expandedSections[section.id];
            return (
              <div key={section.id}>
                {/* Section header: if has children -> toggle accordion, else navigate to page */}
                <button
                  onClick={() => (hasChildren ? toggleSection(section.id) : handlePageClick(section.page))}
                  aria-expanded={hasChildren ? isExpanded : undefined}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-white/5 rounded-lg transition-all",
                    currentPage >= section.page - 1 && "bg-white/10"
                  )}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <div className="flex items-center">
                      {hasChildren ? (
                        isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-foreground" />
                        )
                      ) : (
                        // No accordion icon for items without children: leave empty to match spacing
                        <span aria-hidden className="inline-block h-4 w-4" />
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
                    className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded-full hover:bg-white/10 transition-all min-w-[2rem] text-center"
                  >
                    {section.page}
                  </button>
                </button>

                {/* Children */}
                {hasChildren && isExpanded && (
                  <div className="ml-4 mt-1 space-y-1">
                    {section.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => handlePageClick(child.page)}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 text-left hover:bg-white/5 rounded-lg transition-all",
                          currentPage === child.page - 1 && "bg-white/10 border-l-2 border-primary"
                        )}
                      >
                        <div className="flex items-center gap-2 flex-1">
                          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm text-foreground">
                            {child.title}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded-full hover:bg-white/10 transition-all min-w-[2rem] text-center">
                          {child.page}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border bg-background/80 backdrop-blur-sm">
        <div className="text-xs text-muted-foreground text-center">
          Página {currentPage + 1} de {Math.max(...toc.flatMap(s => [s.page, ...(s.children?.map(c => c.page) || [])]))}
        </div>
      </div>
    </div>
    </>
  );
};

export default TableOfContents;
