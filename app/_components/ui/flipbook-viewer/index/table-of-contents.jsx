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
    // Sección agregada desde el contenido provisto (Salsa Clásica)
    {
    "totalPages": 8,
    "items": [
        {
            "id": "1",
            "title": "Pomarola 60 Recetas bailables",
            "page": 1,
            "children": []
        },
        {
            "id": "2",
            "title": "Salsa Clásica",
            "page": 4,
            "children": [
                {
                    "id": "2.1",
                    "title": "Alitas BBQ con papas fritas",
                    "page": 4,
                    "children": []
                },
                {
                    "id": "2.2",
                    "title": "Cóctel de langostinos en salsa rosé",
                    "page": 4,
                    "children": []
                },
                {
                    "id": "2.3",
                    "title": "Wantán frito con salsa tamarindo",
                    "page": 4,
                    "children": []
                },
                {
                    "id": "2.4",
                    "title": "Albóndigas con arroz",
                    "page": 4,
                    "children": []
                },
                {
                    "id": "2.5",
                    "title": "Rigatónis con salsa arrabbiata",
                    "page": 4,
                    "children": []
                },
                {
                    "id": "2.6",
                    "title": "Berenjena rellena",
                    "page": 4,
                    "children": []
                },
                {
                    "id": "2.7",
                    "title": "Arroz con mariscos",
                    "page": 4,
                    "children": []
                },
                {
                    "id": "2.8",
                    "title": "Pizza carnívora",
                    "page": 4,
                    "children": []
                },
                {
                    "id": "2.9",
                    "title": "Pizza margarita",
                    "page": 4,
                    "children": []
                },
                {
                    "id": "2.10",
                    "title": "Pizza veggie",
                    "page": 4,
                    "children": []
                },
                {
                    "id": "2.11",
                    "title": "Pastel de fideos",
                    "page": 4,
                    "children": []
                },
                {
                    "id": "2.12",
                    "title": "Fajitas Pomarola",
                    "page": 4,
                    "children": []
                },
                {
                    "id": "2.13",
                    "title": "Lasagna rosé",
                    "page": 4,
                    "children": []
                },
                {
                    "id": "2.14",
                    "title": "Pollo entomatado",
                    "page": 4,
                    "children": []
                },
                {
                    "id": "2.15",
                    "title": "Lasagna clásica",
                    "page": 4,
                    "children": []
                },
                {
                    "id": "2.16",
                    "title": "Tallarines con albóndigas de atún",
                    "page": 4,
                    "children": []
                },
                {
                    "id": "2.17",
                    "title": "Tequeños orientales con salsa agridulce",
                    "page": 4,
                    "children": []
                },
                {
                    "id": "2.18",
                    "title": "Lasagna de atún",
                    "page": 4,
                    "children": []
                },
                {
                    "id": "2.19",
                    "title": "Alitas en salsa BBQ tropical",
                    "page": 4,
                    "children": []
                },
                {
                    "id": "2.20",
                    "title": "Pizza a base de avena",
                    "page": 4,
                    "children": []
                },
                {
                    "id": "2.21",
                    "title": "Ñoquis con Salsa Vegetariana",
                    "page": 8,
                    "children": []
                }
            ]
        },
        {
            "id": "3",
            "title": "Concentrado de Tomate",
            "page": 5,
            "children": [
                {
                    "id": "3.1",
                    "title": "Lentejas con pollo al horno",
                    "page": 5,
                    "children": []
                },
                {
                    "id": "3.2",
                    "title": "Garbanzos con seco de cordero",
                    "page": 5,
                    "children": []
                },
                {
                    "id": "3.3",
                    "title": "Trigo con queso",
                    "page": 5,
                    "children": []
                },
                {
                    "id": "3.4",
                    "title": "Pallares con seco de res",
                    "page": 5,
                    "children": []
                },
                {
                    "id": "3.5",
                    "title": "Arvejas con res",
                    "page": 5,
                    "children": []
                },
                {
                    "id": "3.6",
                    "title": "Parihuela",
                    "page": 5,
                    "children": []
                },
                {
                    "id": "3.7",
                    "title": "Relleno de arepas",
                    "page": 5,
                    "children": []
                },
                {
                    "id": "3.8",
                    "title": "Ossobuco al vino",
                    "page": 5,
                    "children": []
                },
                {
                    "id": "3.9",
                    "title": "Tornillos en salsa rosé con pollo a las finas hierbas",
                    "page": 5,
                    "children": []
                },
                {
                    "id": "3.10",
                    "title": "Chupe de pescado",
                    "page": 5,
                    "children": []
                },
                {
                    "id": "3.11",
                    "title": "Papa rellena",
                    "page": 5,
                    "children": []
                },
                {
                    "id": "3.12",
                    "title": "Picante de mariscos",
                    "page": 5,
                    "children": []
                },
                {
                    "id": "3.13",
                    "title": "Pescado a lo macho",
                    "page": 5,
                    "children": []
                },
                {
                    "id": "3.14",
                    "title": "Asado de res",
                    "page": 5,
                    "children": []
                },
                {
                    "id": "3.15",
                    "title": "Tallarines en salsa de vino, vegetales y carne",
                    "page": 5,
                    "children": []
                },
                {
                    "id": "3.16",
                    "title": "Estofado de carne",
                    "page": 5,
                    "children": []
                },
                {
                    "id": "3.17",
                    "title": "Guiso de atún",
                    "page": 5,
                    "children": []
                },
                {
                    "id": "3.18",
                    "title": "Arroz tapado",
                    "page": 5,
                    "children": []
                },
                {
                    "id": "3.19",
                    "title": "Caigua rellena",
                    "page": 5,
                    "children": []
                },
                {
                    "id": "3.20",
                    "title": "Pimiento verde relleno",
                    "page": 5,
                    "children": []
                },
                {
                    "id": "3.21",
                    "title": "Frejoles entomatados",
                    "page": 5,
                    "children": []
                },
                {
                    "id": "3.22",
                    "title": "Empanada",
                    "page": 5,
                    "children": []
                },
                {
                    "id": "3.23",
                    "title": "Sopa criolla",
                    "page": 5,
                    "children": []
                },
                {
                    "id": "3.24",
                    "title": "Estofado amazónico",
                    "page": 5,
                    "children": []
                },
                {
                    "id": "3.25",
                    "title": "Estofado de pavita",
                    "page": 5,
                    "children": []
                },
                {
                    "id": "3.26",
                    "title": "Arroz con chancho",
                    "page": 5,
                    "children": []
                }
            ]
        },
        {
            "id": "4",
            "title": "Salsa Bolognesa",
            "page": 6,
            "children": [
                {
                    "id": "4.1",
                    "title": "Canelones rellenos",
                    "page": 6,
                    "children": []
                },
                {
                    "id": "4.2",
                    "title": "Spaghe tti a la bolognesa",
                    "page": 6,
                    "children": []
                },
                {
                    "id": "4.3",
                    "title": "Ravioles a la bolognesa",
                    "page": 6,
                    "children": []
                },
                {
                    "id": "4.4",
                    "title": "Canutos gratinados a la bolognesa",
                    "page": 6,
                    "children": []
                },
                {
                    "id": "4.5",
                    "title": "Pastel de papa a la bolognesa",
                    "page": 6,
                    "children": []
                }
            ]
        },
        {
            "id": "5",
            "title": "Salsa Casera",
            "page": 7,
            "children": [
                {
                    "id": "5.1",
                    "title": "Fideos con salsa casera y pollo",
                    "page": 7,
                    "children": []
                },
                {
                    "id": "5.2",
                    "title": "Coditos en salsa de vegetales",
                    "page": 7,
                    "children": []
                },
                {
                    "id": "5.3",
                    "title": "Lasagna de berenjena",
                    "page": 7,
                    "children": []
                },
                {
                    "id": "5.4",
                    "title": "Berenjena a la parmesana",
                    "page": 7,
                    "children": []
                },
                {
                    "id": "5.5",
                    "title": "Milanesas de carne a la napolitana",
                    "page": 7,
                    "children": []
                },
                {
                    "id": "5.6",
                    "title": "Pechugas de pollo rellenas",
                    "page": 7,
                    "children": []
                },
                {
                    "id": "5.7",
                    "title": "Zapallo relleno con salsa Pomarola",
                    "page": 7,
                    "children": []
                }
                ]
            }
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
                    "w-full flex items-center justify-between p-2 text-left hover:bg-muted rounded-md transition-colors",
                    currentPage >= section.page - 1 && "bg-muted/50"
                  )}
                >
                  <div className="flex items-center gap-2 flex-1">
                    <div className="flex items-center">
                      {hasChildren ? (
                        isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
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
                    className="text-xs text-muted-foreground hover:text-primary px-2 py-1 rounded hover:bg-primary/10 transition-colors"
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
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border">
        <div className="text-xs text-muted-foreground text-center">
          Página {currentPage + 1} de {Math.max(...toc.flatMap(s => [s.page, ...(s.children?.map(c => c.page) || [])]))}
        </div>
      </div>
    </div>
    </>
  );
};

export default TableOfContents;
