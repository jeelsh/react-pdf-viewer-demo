'use client';
import React, { useState } from 'react';
import { ChevronRight, ChevronDown, FileText, BookOpen } from 'lucide-react';
import { cn } from '@/app/_lib/utils';
import useScreenSize from '@/app/_hooks/use-screensize';

const TableOfContents = ({ isVisible, onToggle, onPageSelect, currentPage }) => {
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

  // Datos de ejemplo para el índice
  const tableOfContents = [
    // Sección agregada desde el contenido provisto (Salsa Clásica)
    {
      id: 'salsaClasica',
      title: 'Salsa Clásica',
      page: 4,
      children: [
        { id: 'sc-alitas-bbq', title: 'Alitas BBQ con papas fritas', page: 4 },
        { id: 'sc-coctel-langostinos', title: 'Cóctel de langostinos en salsa rosé', page: 4 },
        { id: 'sc-noquis-veg', title: 'Ñoquis con salsa vegetariana', page: 4 },
        { id: 'sc-wantan-tamarindo', title: 'Wantán frito con salsa tamarindo', page: 4 },
        { id: 'sc-albondigas-arroz', title: 'Albóndigas con arroz', page: 4 },
        { id: 'sc-rigatonis-arrabbiata', title: 'Rigatónis con salsa arrabbiata', page: 4 },
        { id: 'sc-berenjena-rellena', title: 'Berenjena rellena', page: 4 },
        { id: 'sc-arroz-mariscos', title: 'Arroz con mariscos', page: 4 },
        { id: 'sc-pizza-carnivora', title: 'Pizza carnívora', page: 4 },
        { id: 'sc-pizza-margarita', title: 'Pizza margarita', page: 4 },
        { id: 'sc-pizza-veggie', title: 'Pizza veggie', page: 4 },
        { id: 'sc-pastel-fideos', title: 'Pastel de fideos', page: 4 },
        { id: 'sc-fajitas-pomarola', title: 'Fajitas Pomarola', page: 4 },
        { id: 'sc-lasagna-rose', title: 'Lasagna rosé', page: 4 },
        { id: 'sc-pollo-entomatado', title: 'Pollo entomatado', page: 4 },
        { id: 'sc-lasagna-clasica', title: 'Lasagna clásica', page: 4 },
        { id: 'sc-tallarines-atun', title: 'Tallarines con albóndigas de atún', page: 4 },
        { id: 'sc-tequenos-agridulce', title: 'Tequeños orientales con salsa agridulce', page: 4 },
        { id: 'sc-lasagna-atun', title: 'Lasagna de atún', page: 4 },
        { id: 'sc-alitas-bbq-tropical', title: 'Alitas en salsa BBQ tropical', page: 4 },
        { id: 'sc-pizza-avena', title: 'Pizza a base de avena', page: 4 },
      ]
    },
    // Sección agregada: Concentrado de Tomate
    {
      id: 'concentradoTomate',
      title: 'Concentrado de Tomate',
      page: 5,
      children: [
        { id: 'ct-lentejas-pollo-horno', title: 'Lentejas con pollo al horno', page: 5 },
        { id: 'ct-garbanzos-seco-cordero', title: 'Garbanzos con seco de cordero', page: 5 },
        { id: 'ct-trigo-queso', title: 'Trigo con queso', page: 5 },
        { id: 'ct-pallares-seco-res', title: 'Pallares con seco de res', page: 5 },
        { id: 'ct-arvejas-con-res', title: 'Arvejas con res', page: 5 },
        { id: 'ct-parihuela', title: 'Parihuela', page: 5 },
        { id: 'ct-relleno-arepas', title: 'Relleno de arepas', page: 5 },
        { id: 'ct-ossobuco-vino', title: 'Ossobuco al vino', page: 5 },
        { id: 'ct-tornillos-rose-pollo-finas-hierbas', title: 'Tornillos en salsa rosé con pollo a las finas hierbas', page: 5 },
        { id: 'ct-chupe-pescado', title: 'Chupe de pescado', page: 5 },
        { id: 'ct-papa-rellena', title: 'Papa rellena', page: 5 },
        { id: 'ct-picante-mariscos', title: 'Picante de mariscos', page: 5 },
        { id: 'ct-pescado-lo-macho', title: 'Pescado a lo macho', page: 5 },
        { id: 'ct-asado-res', title: 'Asado de res', page: 5 },
        { id: 'ct-tallarines-vino-vegetales-carne', title: 'Tallarines en salsa de vino, vegetales y carne', page: 5 },
        { id: 'ct-estofado-carne', title: 'Estofado de carne', page: 5 },
        { id: 'ct-guiso-atun', title: 'Guiso de atún', page: 5 },
        { id: 'ct-arroz-tapado', title: 'Arroz tapado', page: 5 },
        { id: 'ct-caigua-rellena', title: 'Caigua rellena', page: 5 },
        { id: 'ct-pimiento-verde-relleno', title: 'Pimiento verde relleno', page: 5 },
        { id: 'ct-frejoles-entomatados', title: 'Frejoles entomatados', page: 5 },
        { id: 'ct-empanada', title: 'Empanada', page: 5 },
        { id: 'ct-sopa-criolla', title: 'Sopa criolla', page: 5 },
        { id: 'ct-estofado-amazonico', title: 'Estofado amazónico', page: 5 },
        { id: 'ct-estofado-pavita', title: 'Estofado de pavita', page: 5 },
        { id: 'ct-arroz-chancho', title: 'Arroz con chancho', page: 5 },
      ]
    },
    // Sección agregada: Salsa Bolognesa
    {
      id: 'salsaBolognesa',
      title: 'Salsa Bolognesa',
      page: 6,
      children: [
        { id: 'sb-canelones-rellenos', title: 'Canelones rellenos', page: 6 },
        { id: 'sb-spaghetti-bolognesa', title: 'Spaghetti a la bolognesa', page: 6 },
        { id: 'sb-ravioles-bolognesa', title: 'Ravioles a la bolognesa', page: 6 },
        { id: 'sb-canutos-gratinados-bolognesa', title: 'Canutos gratinados a la bolognesa', page: 6 },
        { id: 'sb-pastel-papa-bolognesa', title: 'Pastel de papa a la bolognesa', page: 6 },
      ]
    },
    // Sección agregada: Salsa Casera
    {
      id: 'salsaCasera',
      title: 'Salsa Casera',
      page: 7,
      children: [
        { id: 'scas-fideos-salsa-casera-pollo', title: 'Fideos con salsa casera y pollo', page: 7 },
        { id: 'scas-coditos-vegetales', title: 'Coditos en salsa de vegetales', page: 7 },
        { id: 'scas-lasagna-berenjena', title: 'Lasagna de berenjena', page: 7 },
        { id: 'scas-berenjena-parmesana', title: 'Berenjena a la parmesana', page: 7 },
        { id: 'scas-milanesas-napolitana', title: 'Milanesas de carne a la napolitana', page: 7 },
        { id: 'scas-pechugas-rellenas', title: 'Pechugas de pollo rellenas', page: 7 },
        { id: 'scas-zapallo-relleno', title: 'Zapallo relleno con salsa Pomarola', page: 7 },
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
    </>
  );
};

export default TableOfContents;
