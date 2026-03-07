
// ─── Tipos derivados del backend ──────────────────────────────────────────────

/** Valores posibles del campo estado.nombre que llegan desde el backend */
export type EstadoNombre = 'Iniciada' | 'En proceso' | 'Resuelta';

/** Valores posibles del campo prioridad */
export type PrioridadNombre = 'Alta' | 'Media' | 'Baja';

// ─── Sub-interfaces ───────────────────────────────────────────────────────────

export interface EstadoI {
  _id: string;
  nombre: EstadoNombre;
  descripcion: string;
}

export interface CambioEstadoI {
  _id: string;
  fechaHoraCambio: string;
  /** Array de referencias a estado (pueden llegar como string o como objeto con $oid) */
  estadoId: string[];
  estado: EstadoI;
  idUsuario: number | string;
}

// ─── Entidad principal ────────────────────────────────────────────────────────

export interface ReclamoI {
  _id: string;
  fechaHoraInicio: string;
  fechaHoraResuelto: string | null;
  titulo: string | null;
  descripcion: string;
  descripcionResuelto: string | null;
  imagenReclamo: string;
  areaId: string | null;
  proyectoId: string;
  prioridad: PrioridadNombre | null;
  criticidad: string | null;
  estado: EstadoI;
  idUsuario: string;
  nameUsuario: string;
  cambioEstado: CambioEstadoI[];
  historialAreas: any[];
  tipoReclamoId: string;
}

// ─── Opciones de filtro para la UI ────────────────────────────────────────────

export type FiltroEstado = 'Todos' | EstadoNombre;
export type FiltroPrioridad = 'Todas' | PrioridadNombre;