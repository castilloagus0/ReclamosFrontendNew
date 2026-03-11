import React, { useState, useEffect } from 'react';
import { ReclamoI } from '../interfaces/reclamo.interface';
import { getReclamosById } from '../service/reclamo.service';
import TrazabilityTimeline, { getStepsFromReclamo } from './TrazabilityTimeline';

interface TrazabilityChartsProps {
  reclamoId: string | null;
  onClose: () => void;
}

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

  const steps = React.useMemo(() => getStepsFromReclamo(reclamo), [reclamo]);

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

                {/* Trazabilidad horizontal - usa TrazabilityTimeline compartido */}
                <TrazabilityTimeline steps={steps} showTitle={true} />
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
