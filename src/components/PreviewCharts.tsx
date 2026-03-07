import React, { useState, useEffect } from 'react';
import { ReclamoI, ClaimStatus } from '../interfaces/reclamo.interface';



// Estados disponibles para el reclamo — alineados con los del backend
const ESTADOS_RECLAMO: { value: string; label: string }[] = [
    { value: 'iniciada', label: 'Iniciada' },
    { value: 'en_proceso', label: 'En proceso' },
    { value: 'resuelta', label: 'Resuelta' },
];

const statusPillStyles: Record<string, string> = {
    Iniciada: 'bg-amber-50 text-amber-700 border-amber-200',
    'En proceso': 'bg-blue-50 text-blue-700 border-blue-200',
    Resuelta: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const priorityStyles: Record<string, string> = {
    Alta: 'text-rose-600',
    Media: 'text-amber-600',
    Baja: 'text-emerald-600',
};

interface PreviewChartsProps {
    claim: ReclamoI | null;
    onClose: () => void;
    onStatusChange?: (claimId: string, newStatus: ClaimStatus, resolucion?: string) => void;
}

export default function PreviewCharts({ claim, onClose, onStatusChange }: PreviewChartsProps) {
    const [selectedEstado, setSelectedEstado] = useState<string>('');
    const [resolucion, setResolucion] = useState<string>('');
    const [submitted, setSubmitted] = useState<boolean>(false);

    // Resetear estado interno cada vez que se abre un reclamo diferente
    useEffect(() => {
        if (claim) {
            const estadoActual = ESTADOS_RECLAMO.find(
                (e) => e.label.toLowerCase() === (claim.estado?.nombre ?? '').toLowerCase(),
            );
            setSelectedEstado(estadoActual ? estadoActual.value : '');
            setResolucion('');
            setSubmitted(false);
        }
    }, [claim]);

    if (!claim) return null;

    const esFinalizado = selectedEstado === 'finalizado';

    const handleConfirm = () => {
        if (!selectedEstado) return;
        setSubmitted(true);
        if (esFinalizado && !resolucion.trim()) return;

        const estadoLabel =
            (ESTADOS_RECLAMO.find((e) => e.value === selectedEstado)?.label as ClaimStatus) ??
            (selectedEstado as ClaimStatus);

        onStatusChange?.(claim._id, estadoLabel, esFinalizado ? resolucion.trim() : undefined);
        onClose();
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
                onClick={handleBackdropClick}
                role="dialog"
                aria-modal="true"
                aria-label="Detalle del reclamo"
            >
                {/* Modal */}
                <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#e5e7eb] overflow-hidden animate-slide-up">

                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e7eb] bg-[#f9fafb]">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[22px] text-indigo-500">inbox</span>
                            <h2 className="text-base font-bold text-[#111827]">Detalle del reclamo</h2>
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
                    <div className="px-6 py-5 space-y-5">
                        {/* Info del reclamo */}
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
                                </div>
                            </div>

                            {/* ID */}
                            {/* <div className="bg-[#f9fafb] rounded-xl p-3 border border-[#e5e7eb]">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#9ca3af] mb-1">ID</p>
                                <p className="text-xs font-mono text-[#4b5563] break-all">{claim.id}</p>
                            </div> */}

                            {/* Fecha */}
                            <div className="bg-[#f9fafb] rounded-xl p-3 border border-[#e5e7eb]">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#9ca3af] mb-1">Fecha</p>
                                <p className="text-sm font-semibold text-[#111827]">
                                    {new Date(claim.fechaHoraInicio).toLocaleDateString('es-AR', {
                                        day: '2-digit', month: '2-digit', year: 'numeric'
                                    })}
                                </p>
                            </div>

                            {/* Estado actual */}
                            <div className="bg-[#f9fafb] rounded-xl p-3 border border-[#e5e7eb]">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#9ca3af] mb-1">Estado</p>
                                <span
                                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusPillStyles[claim.estado?.nombre ?? ''] ?? 'bg-gray-50 text-gray-700 border-gray-200'
                                        }`}
                                >
                                    {claim.estado?.nombre}
                                </span>
                            </div>

                            {/* Prioridad */}
                            <div className="bg-[#f9fafb] rounded-xl p-3 border border-[#e5e7eb]">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#9ca3af] mb-1">Prioridad</p>
                                <span
                                    className={`text-xs font-semibold uppercase tracking-wide ${priorityStyles[claim.prioridad ?? ''] ?? 'text-[#4b5563]'
                                        }`}
                                >
                                    {claim.prioridad ?? '—'}
                                </span>
                            </div>

                            {/* { Descripcion del reclamo} */}
                            {/* <div className="bg-[#f9fafb] rounded-xl p-3 border border-[#e5e7eb]">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#9ca3af] mb-1">Descripcion</p>
                                <span
                                    className={`text-xs font-semibold uppercase tracking-wide ${priorityStyles[claim.descripcion] ?? 'text-[#4b5563]'
                                        }`}
                                >
                                    {claim.priority}
                                </span>
                            </div> */}
                        </div>

                        <div className="border-t border-[#e5e7eb]" />

                        {/* Cambiar estado */}
                        <div className="space-y-3">
                            <p className="text-xs font-bold uppercase tracking-wider text-[#6b7280]">
                                Cambiar estado del reclamo
                            </p>

                            <select
                                value={selectedEstado}
                                onChange={(e) => {
                                    setSelectedEstado(e.target.value);
                                    setResolucion('');
                                    setSubmitted(false);
                                }}
                                className="w-full rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2.5 text-sm text-[#111827] outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                            >
                                <option value="" disabled>— Seleccioná un estado —</option>
                                {ESTADOS_RECLAMO.map((est) => (
                                    <option key={est.value} value={est.value}>
                                        {est.label}
                                    </option>
                                ))}
                            </select>

                            {/* Descripción de resolución — solo cuando sea "Finalizado" */}
                            {esFinalizado && (
                                <div className="space-y-1.5 animate-fade-in">
                                    <label htmlFor="resolucion-input" className="text-xs font-semibold text-[#4b5563]">
                                        Descripción de la resolución <span className="text-rose-500">*</span>
                                    </label>
                                    <textarea
                                        id="resolucion-input"
                                        rows={3}
                                        value={resolucion}
                                        onChange={(e) => setResolucion(e.target.value)}
                                        placeholder="Describí cómo se resolvió el reclamo..."
                                        className={`w-full rounded-xl border px-3 py-2 text-sm text-[#111827] resize-none outline-none transition-all ${submitted && !resolucion.trim()
                                            ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50'
                                            : 'border-[#e5e7eb] bg-[#f9fafb] focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100'
                                            }`}
                                    />
                                    {submitted && !resolucion.trim() && (
                                        <p className="text-xs text-rose-500">
                                            Este campo es requerido para finalizar el reclamo.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-[#e5e7eb] bg-[#f9fafb]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-xl text-sm font-medium text-[#4b5563] hover:bg-[#e5e7eb] transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            disabled={!selectedEstado}
                            className="px-5 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                        >
                            Confirmar cambio
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
