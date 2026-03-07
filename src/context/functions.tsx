import { EstadoNombre, PrioridadNombre } from '../interfaces/reclamo.interface';

/**
 * Devuelve las clases CSS para la píldora de estado según
 * el nombre de estado que llega del backend.
 */
export function statusPillClasses(estado: EstadoNombre | string): string {
  switch (estado) {
    case 'Iniciada':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'En proceso':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Resuelta':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    default:
      return 'bg-gray-50 text-gray-600 border-gray-200';
  }
}

/**
 * Devuelve las clases CSS de texto para la prioridad según
 * el valor que llega del backend.
 */
export function priorityTextClasses(prioridad: PrioridadNombre | string | null): string {
  switch (prioridad) {
    case 'Alta':
      return 'text-rose-600';
    case 'Media':
      return 'text-amber-600';
    case 'Baja':
      return 'text-emerald-600';
    default:
      return 'text-gray-400';
  }
}