import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Layers,
  Binary,
  BookOpen,
  Code2,
  Database,
  FileCode,
} from 'lucide-react';

export const AcademicTicker: React.FC = () => {
  const { course } = useApp();
  const m = course?.metricas;

  const items = [
    { icon: <Layers size={13} />, label: `${m?.totalTemas ?? 24} temas de investigación curricular` },
    { icon: <Binary size={13} />, label: `${m?.totalBusquedas ?? 360} ecuaciones booleanas verificadas` },
    { icon: <BookOpen size={13} />, label: `${m?.documentosSeleccionados ?? 127} artículos científicos y referencias DOI` },
    { icon: <Code2 size={13} />, label: `${m?.ejemplosR ?? 24} modelos reproducibles en R` },
    { icon: <Database size={13} />, label: `${m?.datasets ?? 26} datasets tabulares catalogados` },
    { icon: <FileCode size={13} />, label: `${m?.documentosLatex ?? 26} capítulos LaTeX para sustentación` },
  ];

  // Duplicar items para scroll continuo fluido e infinito
  const trackItems = [...items, ...items];

  return (
    <div
      className="atlas-ticker-container"
      role="region"
      aria-label="Cifras verificadas de la investigación"
    >
      <div className="atlas-ticker-track">
        {trackItems.map((item, idx) => (
          <div key={idx} className="atlas-ticker-item">
            <span className="atlas-ticker-icon">{item.icon}</span>
            <span className="atlas-ticker-text">{item.label}</span>
            <span className="atlas-ticker-dot" aria-hidden="true">•</span>
          </div>
        ))}
      </div>
    </div>
  );
};
