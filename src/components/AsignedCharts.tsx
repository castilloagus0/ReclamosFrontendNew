import React, { useState, useEffect } from 'react';
import { ReclamoI } from '../interfaces/reclamo.interface';
import { AgenteI } from '../interfaces/agente.interface';
import { statusPillStyles } from '../components/Icons';
import { normalizarPrioridadCriticidad } from '../context/functions';
import { getAgentes } from '../service/agentes.service';
import { cambiarArea } from '../service/reclamo.service';
import { toast } from 'sonner';

const AREAS = [
  { id: 'soporte', nombre: 'Soporte' },
  { id: 'finanzas', nombre: 'Finanzas' },
];

interface AsignedChartsProps {
  claim: ReclamoI | null;
  onClose: () => void;
  onAssignSuccess?: () => void;
}

export default function AsignedCharts({
  claim,
  onClose,
  onAssignSuccess,
}: AsignedChartsProps) {
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [selectedAgenteId, setSelectedAgenteId] = useState<string>('');
  const [agentes, setAgentes] = useState<AgenteI[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAgentes = async () => {
      try {
        const data = await getAgentes();
        setAgentes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al obtener agentes:', error);
        toast.error('Error al cargar agentes');
      }
    };
    fetchAgentes();
  }, []);

  useEffect(() => {
    if (claim) {
      setSelectedArea('');
      setSelectedAgenteId('');
    }
  }, [claim]);

  const handleAsignar = async () => {
    if (!claim || !selectedArea || !selectedAgenteId) {
      toast.error('Seleccioná un área y un agente');
      return;
    }
    setLoading(true);
    try {
      await cambiarArea(selectedArea, selectedAgenteId, claim._id);
      toast.success('Reclamo asignado correctamente');
      onClose();
      onAssignSuccess?.();
    } catch (err) {
      console.error('Error al asignar:', err);
      toast.error('Error al asignar. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!claim) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-label="Asignar reclamo"
      >
        {/* Modal */}
        <div className="relative w-full max-w-[50rem] max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-[#e5e7eb] overflow-hidden animate-slide-up flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb] bg-[#f9fafb]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px] text-indigo-500">
                group_add
              </span>
              <h2 className="text-base font-bold text-[#111827]">Asignar reclamo</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#6b7280] hover:bg-[#e5e7eb] transition-colors"
              aria-label="Cerrar"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-5 overflow-y-auto flex-1">
            {/* Info del reclamo - mismo layout que PreviewCharts */}
            <div className="grid grid-cols-2 gap-3">
              {/* Usuario */}
              <div className="col-span-2 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-sm flex-shrink-0">
                  {(claim.nameUsuario ?? '?')
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111827]">{claim.nameUsuario}</p>
                  <p className="text-xs text-[#6b7280]">{claim.emailUsuario}</p>
                </div>
              </div>

              {/* Fecha */}
              <div className="bg-[#f9fafb] rounded-xl p-3 border border-[#e5e7eb]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#9ca3af] mb-1">
                  Fecha
                </p>
                <p className="text-sm font-semibold text-[#111827]">
                  {new Date(claim.fechaHoraInicio).toLocaleDateString('es-AR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </p>
              </div>

              {/* Estado actual */}
              <div className="bg-[#f9fafb] rounded-xl p-3 border border-[#e5e7eb]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#9ca3af] mb-1">
                  Estado
                </p>
                <span
                  className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                    statusPillStyles[claim.estado?.nombre ?? ''] ??
                    'bg-gray-50 text-gray-700 border-gray-200'
                  }`}
                >
                  {claim.estado?.nombre}
                </span>
              </div>

              {/* Prioridad */}
              <div className="bg-[#f9fafb] rounded-xl p-3 border border-[#e5e7eb]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#9ca3af] mb-1">
                  Prioridad
                </p>
                <p className="text-sm font-semibold text-[#111827]">
                  {normalizarPrioridadCriticidad(claim.prioridad) || '—'}
                </p>
              </div>

              {/* Criticidad */}
              <div className="bg-[#f9fafb] rounded-xl p-3 border border-[#e5e7eb]">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#9ca3af] mb-1">
                  Criticidad
                </p>
                <p className="text-sm font-semibold text-[#111827]">
                  {normalizarPrioridadCriticidad(claim.criticidad) || '—'}
                </p>
              </div>
            </div>

            <div className="border-t border-[#e5e7eb]" />

            {/* Descripción */}
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                Descripción
              </p>
              <p className="text-sm text-[#373f4a] leading-relaxed p-1">
                {claim.descripcion ?? '—'}
              </p>
            </div>

            <div className="border-t border-[#e5e7eb]" />

            {/* Asignar área y agente - reemplaza "Cambiar estado" de PreviewCharts */}
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                Asignar a área y agente
              </p>

              <div className="grid grid-cols-2 gap-4">
                {/* Área */}
                <div className="bg-[#f9fafb] rounded-xl p-3 border border-[#e5e7eb]">
                  <label
                    htmlFor="area-select"
                    className="text-[10px] font-bold uppercase tracking-wider text-[#9ca3af] mb-2 block"
                  >
                    Área
                  </label>
                  <select
                    id="area-select"
                    value={selectedArea}
                    onChange={(e) => setSelectedArea(e.target.value)}
                    className="w-full rounded-xl border border-[#e5e7eb] bg-white px-3 py-2.5 text-sm text-[#111827] outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="">— Seleccioná un área —</option>
                    {AREAS.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Agente */}
                <div className="bg-[#f9fafb] rounded-xl p-3 border border-[#e5e7eb]">
                  <label
                    htmlFor="agente-select"
                    className="text-[10px] font-bold uppercase tracking-wider text-[#9ca3af] mb-2 block"
                  >
                    Agente
                  </label>
                  <select
                    id="agente-select"
                    value={selectedAgenteId}
                    onChange={(e) => setSelectedAgenteId(e.target.value)}
                    className="w-full rounded-xl border border-[#e5e7eb] bg-white px-3 py-2.5 text-sm text-[#111827] outline-none transition-all focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="">— Seleccioná un agente —</option>
                    {agentes.map((a) => (
                      <option key={a._id} value={a._id}>
                        {a.nombreCompleto}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - mismo estilo que PreviewCharts */}
          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-[#e5e7eb] bg-[#f9fafb] flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-[#4b5563] hover:bg-[#e5e7eb] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleAsignar}
              disabled={!selectedArea || !selectedAgenteId || loading}
              className="px-5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-[#447f23] hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {loading ? 'Asignando...' : 'Asignar'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fade-in  { animation: fadeIn  0.18s ease both; }
        .animate-slide-up { animation: slideUp 0.22s cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>
    </>
  );
}
