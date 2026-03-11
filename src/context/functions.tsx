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
    case 'En Proceso':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Resuelta':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    default:
      return 'bg-gray-50 text-gray-600 border-gray-200';
  }
}

const NUMBER_TO_LABEL: Record<number, PrioridadNombre> = {
  1: 'Baja',
  2: 'Media',
  3: 'Alta',
};

/**
 * Convierte un número a su etiqueta de prioridad/criticidad.
 */
function numberToLabel(n: number): string {
  return NUMBER_TO_LABEL[n] ?? '';
}

/**
 * Normaliza prioridad/criticidad que pueden venir como string, número o como objeto
 * desde el backend. Siempre devuelve el nombre legible (Alta, Media, Baja).
 */
export function normalizarPrioridadCriticidad(
  valor:
    | PrioridadNombre
    | string
    | number
    | { prioridad?: string | number }
    | { criticidad?: string | number }
    | { nombre?: string }
    | null
    | undefined
): string {
  if (valor == null) return '';
  if (typeof valor === 'number') return numberToLabel(valor);
  if (typeof valor === 'string') {
    const num = parseInt(valor, 10);
    if (!Number.isNaN(num)) return numberToLabel(num);
    if (valor === 'Alta' || valor === 'Media' || valor === 'Baja') return valor;
    const match = valor.match(/^(\d+)\s*\((\w+)\)$/i);
    if (match) return match[2].charAt(0).toUpperCase() + match[2].slice(1).toLowerCase();
    return valor;
  }
  if (typeof valor === 'object') {
    const v = valor as Record<string, unknown>;
    const raw = v.prioridad ?? v.criticidad ?? v.nombre;
    if (raw == null) return '';
    return normalizarPrioridadCriticidad(raw as string | number);
  }
  return '';
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