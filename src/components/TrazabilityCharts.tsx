import React, { useState, useEffect } from 'react';
import { ReclamoI } from '../interfaces/reclamo.interface';
import { statusPillClasses } from '../context/functions';
import { getReclamosById } from '../service/reclamo.service';

interface TrazabilityChartsProps {
  reclamoId: string | null;
  onClose: () => void;
}

type TrazabilityStep = {
  label: string;
  fecha: string;
  isLast?: boolean;
};

export default function TrazabilityCharts({ reclamoId, onClose }: TrazabilityChartsProps) {
  const [reclamo, setReclamo] = useState<ReclamoI | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reclamoId) return;
    const fetchReclamo = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getReclamosById(reclamoId);
        setReclamo(data?.data ?? data ?? null);
      } catch (err) {
        console.error('Error fetching reclamo:', err);
        setError('No se pudo cargar la trazabilidad del reclamo.');
        setReclamo(null);
      } finally {
        setLoading(false);
      }
    };
    fetchReclamo();
  }, [reclamoId]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const steps: TrazabilityStep[] = React.useMemo(() => {
    if (!reclamo) return [];

    const result: TrazabilityStep[] = [];

    // Paso inicial: creación del reclamo (Iniciada)
    result.push({
      label: 'Iniciada',
      fecha: reclamo.fechaHoraInicio,
    });

    // Pasos intermedios: cambios de estado
    const cambios = reclamo.cambioEstado ?? [];
    const ordenados = [...cambios].sort(
      (a, b) => new Date(a.fechaHoraCambio).getTime() - new Date(b.fechaHoraCambio).getTime()
    );
    ordenados.forEach((c) => {
      const nombre = c.estado?.nombre ?? 'Cambio de estado';
      result.push({
        label: nombre,
        fecha: c.fechaHoraCambio,
      });
    });

    // Marcar el último paso
    if (result.length > 0) {
      result[result.length - 1].isLast = true;
    }

    return result;
  }, [reclamo]);

  if (!reclamoId) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-label="Trazabilidad del reclamo"
      >
        <div
          className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-[#e5e7eb] overflow-hidden animate-slide-up flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb] bg-[#f9fafb] flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[22px] text-indigo-500">timeline</span>
              <h2 className="text-base font-bold text-[#111827]">Trazabilidad del reclamo</h2>
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
          <div className="px-6 py-5 overflow-y-auto flex-1">
            {loading && (
              <div className="flex flex-col items-center justify-center py-16 text-[#6b7280]">
                <span className="material-symbols-outlined text-5xl animate-pulse">hourglass_empty</span>
                <p className="mt-3 text-sm font-medium">Cargando trazabilidad...</p>
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center justify-center py-16">
                <span className="material-symbols-outlined text-5xl text-rose-400">error</span>
                <p className="mt-3 text-sm font-medium text-rose-600">{error}</p>
              </div>
            )}

            {!loading && !error && reclamo && (
              <div className="space-y-6">
                {/* Info resumida del reclamo */}
                <div className="flex items-center gap-3 pb-4 border-b border-[#e5e7eb]">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-sm flex-shrink-0">
                    {(reclamo.nameUsuario ?? '?')
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#111827]">{reclamo.nameUsuario}</p>
                    <p className="text-xs text-[#6b7280]">
                      ID: {reclamo._id} · {reclamo.titulo ?? 'Reclamo'}
                    </p>
                  </div>
                </div>

                {/* Trazabilidad horizontal */}
                <div className="pt-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#6b7280] mb-4">
                    Historial de estados
                  </p>
                  <div className="relative flex items-start overflow-x-auto pb-4 px-2">
                    <div className="flex items-start gap-2 min-w-min">
                      {steps.map((step, index) => (
                        <React.Fragment key={`${step.fecha}-${step.label}-${index}`}>
                          <div className="flex flex-col items-center flex-shrink-0 min-w-[100px]">
                            <div className="relative flex items-center justify-center">
                              <div
                                className={`w-4 h-4 rounded-full border-2 border-white shadow-sm flex-shrink-0 ${
                                  step.label === 'Iniciada'
                                    ? 'bg-amber-400'
                                    : step.label === 'Resuelta'
                                    ? 'bg-emerald-500'
                                    : 'bg-blue-400'
                                }`}
                              />
                            </div>
                            <div
                              className={`mt-2 inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusPillClasses(step.label)}`}
                            >
                              {step.label}
                            </div>
                            <p className="mt-1.5 text-[10px] text-[#6b7280] text-center leading-tight max-w-[90px]">
                              {new Date(step.fecha).toLocaleDateString('es-AR', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                          {!step.isLast && (
                            <div className="flex items-center flex-shrink-0 pt-2 w-12 justify-center">
                              <span className="material-symbols-outlined text-[20px] text-[#d1d5db]">
                                east
                              </span>
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>

                {steps.length === 0 && (
                  <p className="text-sm text-[#6b7280] py-4">
                    No hay historial de estados disponible.
                  </p>
                )}
              </div>
            )}
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
