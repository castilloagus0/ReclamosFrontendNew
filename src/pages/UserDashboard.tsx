import React, { useMemo, useState, useEffect } from 'react';

import Navbar from '../components/Navbar';
import MenuDashboard from '../components/menuDashboard';

import { toast } from 'sonner';

import { getReclamosByUser } from '../service/reclamo.service';
import { ReclamoI } from '../interfaces/reclamo.interface';

/** Gráfico circular de progreso tipo donut */
const CircularProgressChart = ({ percent = 75, label = 'SOLVED', sublabel = 'Est. 2 días restantes' }: { percent?: number; label?: string; sublabel?: string }) => {
  const r = 45;
  const stroke = 8;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={r} stroke="#e5e7eb" strokeWidth={stroke} fill="none" />
          <circle
            cx="50"
            cy="50"
            r={r}
            stroke="var(--color-primary)"
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-extrabold text-[#111827]">
            {percent}%
          </span>
          <span className="text-[10px] font-bold text-[#6b7280] uppercase">
            {label}
          </span>
        </div>
      </div>
      <p className="text-xs text-[#6b7280] mt-2 text-center">{sublabel}</p>
    </div>
  );
};

/** Trazabilidad horizontal hardcodeada */
const TraceabilityJourney = () => {
  const steps = [
    { id: 1, label: 'Enviado', date: '12 Oct', icon: 'check', completed: true },
    { id: 2, label: 'Soporte', date: '13 Oct', icon: 'support_agent', completed: true },
    { id: 3, label: 'Revisión Legal', date: '15 Oct', icon: 'balance', completed: true },
    { id: 4, label: 'Finanzas', date: 'En progreso', icon: 'account_balance', completed: true, inProgress: true },
    { id: 5, label: 'Resuelto', date: 'Pendiente', icon: 'check_circle', completed: false },
  ];

  return (
    <div className="w-full">
      <h3 className="text-sm font-bold text-[#111827] mb-4">Trazabilidad del reclamo</h3>
      <div className="flex items-start justify-between gap-2">
        {steps.map((step, idx) => {
          const isCompleted = step.completed;
          const isLast = idx === steps.length - 1;
          const nextStep = steps[idx + 1];
          const lineToNextBlue = nextStep && (nextStep.completed || nextStep.inProgress);
          return (
            <div key={step.id} className="flex flex-col items-center flex-1 min-w-0">
              <div className="flex items-center w-full">
                {idx > 0 && (
                  <div
                    className={`flex-1 h-0.5 -mr-1 ${isCompleted ? 'bg-[var(--color-primary)]' : 'bg-[#e5e7eb]'}`}
                    style={{ minWidth: '8px' }}
                  />
                )}
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted ? 'bg-[var(--color-primary)] text-white' : 'bg-[#e5e7eb] text-[#9ca3af]'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">{step.icon}</span>
                </div>
                {!isLast && (
                  <div
                    className={`flex-1 h-0.5 -ml-1 ${lineToNextBlue ? 'bg-[var(--color-primary)]' : 'bg-[#e5e7eb]'}`}
                    style={{ minWidth: '8px' }}
                  />
                )}
              </div>
              <div className="mt-2 text-center">
                <p className="text-xs font-semibold text-[#111827] truncate">{step.label}</p>
                <p className="text-[10px] text-[#6b7280]">{step.date}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function UserDashboard() {
  const [tab, setTab] = useState<'todos' | 'activos' | 'resueltos'>('todos');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reclamos, setReclamos] = useState<ReclamoI[]>([]);

  useEffect(() => {
    let isMounted = true;
    const idUsuario = localStorage.getItem('id') || '';
    
    const getReclamosUser = async () => {
      try {
        const data: ReclamoI[] = await getReclamosByUser(idUsuario);
        if (isMounted) {
          setReclamos(data);
          if (data.length > 0) setSelectedId(data[0]._id);
          if (data.length === 0) toast.error('Aun no hay reclamos registrados en su usuario');
        }
      } catch (err) {
        if (isMounted) console.error(err);
      }
    };
    
    getReclamosUser();
    return () => { isMounted = false; };
  }, []);

  const filteredClaims = useMemo(() => {
    const q = query.trim().toLowerCase();
    return reclamos.filter((c) => {
      if (!q) return true;
      return (
        c._id.toLowerCase().includes(q) ||
        (c.descripcion || '').toLowerCase().includes(q) ||
        (c.estado?.nombre || '').toLowerCase().includes(q)
      );
    });
  }, [reclamos, query]);

  const selectedClaim = useMemo(
    () => reclamos.find((c) => c._id === selectedId) ?? filteredClaims[0],
    [reclamos, filteredClaims, selectedId],
  );

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-page)] text-[var(--color-text)]">
      {/* Top bar (estilo dashboard) */}
      <Navbar />      

      <main className="flex-1 flex min-h-0">
        <MenuDashboard variant="user">
          <div className="space-y-4">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-sm font-semibold text-[#111827]">Tus reclamos</p>
                <p className="text-xs text-[#6b7280]">
                  Mostrando {filteredClaims.length} solicitudes
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              {(
                [
                  { id: 'todos', label: 'Todos', activeClass: 'bg-[var(--color-primary)] text-[#111827] border-[var(--color-primary)]' },
                  { id: 'activos', label: 'Activos', activeClass: 'bg-amber-500 text-[#111827] border-amber-500' },
                  { id: 'resueltos', label: 'Resueltos', activeClass: 'bg-green-500 text-[#111827] border-green-500' },
                ] as const
              ).map((t) => {
                const isActive = tab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={`rounded-lg border-2 px-3 py-1.5 text-sm font-semibold transition-colors ${
                      isActive ? t.activeClass : 'border-[#e5e7eb] bg-white text-[#6b7280] hover:bg-[#f9fafb]'
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>

            <div className="space-y-3" id="reclamos">
              {filteredClaims.map((c) => {
                const isSelected = selectedClaim?._id === c._id;
                const fecha = new Date(c.fechaHoraInicio).toLocaleDateString('es-AR');
                const estadoNombre = (c.estado?.nombre || 'Sin estado').toLowerCase();
                const isResuelto = estadoNombre.includes('resuelto') || estadoNombre.includes('finalizado');
                const isAccion = estadoNombre.includes('acción') || estadoNombre.includes('pendiente') || estadoNombre.includes('verificación');
                const barColor = isResuelto ? 'bg-green-500' : isAccion ? 'bg-amber-500' : 'bg-[var(--color-primary)]';
                const badgeClass = isResuelto
                  ? 'bg-green-100 text-green-700 border-green-200'
                  : isAccion
                    ? 'bg-amber-100 text-amber-700 border-amber-200'
                    : 'bg-blue-100 text-blue-700 border-blue-200';
                const progress = isResuelto ? 100 : isAccion ? 20 : 75;
                const currentAt = isResuelto ? 'Resultado final: Aprobado' : 'Actualmente en: Finanzas';

                return (
                  <button
                    key={c._id}
                    type="button"
                    onClick={() => setSelectedId(c._id)}
                    className={`w-full rounded-xl border text-left p-3 transition-colors ${
                      isSelected
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                        : 'border-[#e5e7eb] bg-white hover:bg-[#f9fafb]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${badgeClass}`}>
                        {c.estado?.nombre || 'Sin estado'}
                      </span>
                      <span className="text-[11px] text-[#9ca3af]">{fecha}</span>
                    </div>

                    <p className="text-sm font-extrabold text-[#111827]">
                      {c.titulo || c.descripcion?.substring(0, 50) || 'Sin título'}
                    </p>
                    <p className="mt-0.5 text-xs text-[#6b7280]">{currentAt}</p>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-[#e5e7eb] overflow-hidden">
                      <div className={`h-full rounded-full ${barColor} transition-all`} style={{ width: `${progress}%` }} />
                    </div>
                  </button>
                );
              })}

              {filteredClaims.length === 0 && (
                <div className="rounded-xl border border-dashed border-[#d1d5db] bg-[#f9fafb] p-4 text-center">
                  <p className="text-sm font-semibold text-[#111827]">No hay resultados</p>
                  <p className="text-xs text-[#6b7280] mt-1">
                    Probá con otro texto de búsqueda o cambiá el filtro.
                  </p>
                </div>
              )}
            </div>
          </div>
        </MenuDashboard>

        {/* Right content */}
        <section className="flex-1 min-h-0 overflow-y-auto px-4 py-6 md:px-8 lg:px-10 bg-[#eff6ff]">
          <div className="w-full max-w-[980px] mx-auto space-y-6">
            {/* Search (mobile) */}
            <div className="sm:hidden flex items-center gap-2 rounded-xl border border-[#e5e7eb] bg-white px-3 py-2">
              <span className="material-symbols-outlined text-[18px] text-[#6b7280]">
                search
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#9ca3af] text-[#111827]"
                placeholder="Buscar reclamos..."
                aria-label="Buscar reclamos"
              />
            </div>

            {selectedClaim ? (
              <>
                {/* Claim header */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="inline-flex items-center rounded-full bg-[var(--color-primary)] text-white px-3 py-1.5 text-[11px] font-extrabold tracking-wider uppercase">
                          {selectedClaim.estado?.nombre || 'Sin estado'}
                        </span>
                        <span className="text-xs text-[#6b7280]">
                          Presentado el {new Date(selectedClaim.fechaHoraInicio).toLocaleDateString('es-AR')}
                        </span>
                      </div>

                      <h4 className="text-xl md:text-3xl font-extrabold text-[#111827] tracking-tight">
                        Reclamo: {selectedClaim.titulo || selectedClaim.descripcion?.substring(0, 50)}
                      </h4>
                      <p className="text-sm text-[#4b5563] leading-relaxed max-w-3xl">
                        {selectedClaim.descripcion}
                      </p>
                    </div>
                    <div className="flex-shrink-0 flex justify-center lg:justify-end">
                      <CircularProgressChart percent={75} label="Resuelto" sublabel="Est. 2 días restantes" />
                    </div>
                  </div>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-5">
                    <p className="text-xs font-bold tracking-wider uppercase text-[#6b7280] mb-2">
                      Prioridad interna
                    </p>
                    <p className="text-lg font-extrabold text-[#111827] flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber-500 text-xl">priority_high</span>
                      {selectedClaim.prioridad || 'Alta'}
                    </p>
                    <p className="text-xs text-[#6b7280] mt-1">Escalar si hay demora</p>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-5">
                    <p className="text-xs font-bold tracking-wider uppercase text-[#6b7280] mb-2">
                      Agente asignado
                    </p>
                    <p className="text-lg font-extrabold text-[#111827]">
                      {selectedClaim.nameUsuario || 'Usuario'}
                    </p>
                    <p className="text-xs text-[#6b7280] mt-1">Soporte al cliente</p>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-5">
                    <p className="text-xs font-bold tracking-wider uppercase text-[#6b7280] mb-2">
                      Categoría del caso
                    </p>
                    <p className="text-lg font-extrabold text-[#111827]">
                      Facturación y reembolsos
                    </p>
                    <p className="text-xs text-[#6b7280] mt-1">Acuerdo de servicio</p>
                  </div>
                </div>

                {/* Trazabilidad horizontal */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-6">
                  <TraceabilityJourney />
                </div>

                {/* Activity */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-extrabold text-[#111827]">
                      Historial de actividad
                    </h2>
                  </div>

                  <ol className="space-y-4">
                    {(selectedClaim.cambioEstado?.length
                      ? selectedClaim.cambioEstado
                      : [
                          { _id: '1', estado: { nombre: 'Transferido a Finanzas', descripcion: 'Revisión legal completada. Caso derivado a Finanzas para cálculo y aprobación.' }, fechaHoraCambio: new Date().toISOString() },
                          { _id: '2', estado: { nombre: 'Verificación de documentos', descripcion: 'Se verificó factura de compra y garantía.' }, fechaHoraCambio: new Date(Date.now() - 86400000).toISOString() },
                          { _id: '3', estado: { nombre: 'Reclamo inicializado', descripcion: 'El sistema recibió la solicitud vía portal web.' }, fechaHoraCambio: selectedClaim.fechaHoraInicio },
                        ]
                    ).map((cambio: { _id: string; estado?: { nombre: string; descripcion?: string }; fechaHoraCambio: string }, idx: number) => (
                      <li key={cambio._id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <span className="mt-1 w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]" />
                          {idx !== (selectedClaim.cambioEstado?.length || 3) - 1 && <span className="flex-1 min-h-[20px] w-[2px] bg-[#e5e7eb] mt-2" />}
                        </div>
                        <div className="flex-1 pb-1">
                          <div className="flex items-start justify-between gap-4">
                            <p className="text-sm font-extrabold text-[#111827]">{cambio.estado?.nombre || 'Estado desconocido'}</p>
                            <p className="text-xs text-[#9ca3af] whitespace-nowrap">
                              {new Date(cambio.fechaHoraCambio).toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' })}
                            </p>
                          </div>
                          <p className="mt-1 text-sm text-[#4b5563] leading-relaxed">
                            {cambio.estado?.descripcion || 'Sin descripción'}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>

                  <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-[#e5e7eb]">
                    <button
                      type="button"
                      className="px-5 py-2.5 rounded-lg bg-[var(--color-primary)] text-white font-semibold text-sm hover:opacity-90 transition-opacity"
                    >
                      Subir documentos
                    </button>
                  </div>
                </div>

              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-6">
                <p className="text-lg font-extrabold text-[#111827]">Seleccioná un reclamo</p>
                <p className="text-sm text-[#6b7280] mt-1">
                  Elegí un reclamo desde el panel izquierdo para ver los detalles.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
