export interface EstadoI {
  _id: string;
  nombre: string;
  descripcion: string;
}

export interface CambioEstadoI {
  _id: string;
  fechaHoraCambio: string;
  estadoId: string[];
  estado: EstadoI;
  idUsuario: number;
}

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
  prioridad: string | null;
  criticidad: string | null;
  estado: EstadoI;
  idUsuario: string;
  nameUsuario: string;
  cambioEstado: CambioEstadoI[];
  historialAreas: any[];
  tipoReclamoId: string;
}