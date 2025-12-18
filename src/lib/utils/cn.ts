import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility para combinar classnames con Tailwind
 * Resuelve conflictos de clases de Tailwind automáticamente
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
