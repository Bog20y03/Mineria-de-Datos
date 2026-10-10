import { useState, useEffect } from 'react';

export interface UseCountUpOptions {
  duration?: number;
  decimals?: number;
}

/**
 * Hook sobrio useCountUp para animar métricas reales desde 0 hasta el valor final.
 * - Solo anima hacia el valor real devuelto por la API / datos físicos.
 * - Si el valor es null, undefined o inválido, devuelve 'Sin datos registrados'.
 * - Respeta automáticamente `prefers-reduced-motion` mostrando el valor final de inmediato.
 */
export function useCountUp(
  targetValue: number | string | null | undefined,
  options: UseCountUpOptions = {}
): string | number {
  const { duration = 800, decimals = 0 } = options;

  // Validación de valor no registrado
  if (targetValue === null || targetValue === undefined || targetValue === '') {
    return 'Sin datos registrados';
  }

  // Parsear número si es string numérico
  const numericTarget = typeof targetValue === 'number' ? targetValue : Number(targetValue);

  if (Number.isNaN(numericTarget)) {
    // Si es un string con texto (ej: "24/24" o "100 + 5"), devolverlo tal cual sin inventar
    return targetValue;
  }

  const [currentValue, setCurrentValue] = useState<number>(0);

  useEffect(() => {
    // Si el usuario prefiere movimiento reducido, asignar directamente el valor final
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setCurrentValue(numericTarget);
      return;
    }

    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing out cubic: rápido al inicio, deceleración suave al llegar a la meta
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const val = easeProgress * numericTarget;

      setCurrentValue(val);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCurrentValue(numericTarget);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [numericTarget, duration]);

  return decimals > 0 ? currentValue.toFixed(decimals) : Math.round(currentValue);
}
