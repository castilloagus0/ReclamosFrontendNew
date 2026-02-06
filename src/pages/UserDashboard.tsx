import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Sidebar from '../components/Sidebar';

type ClaimStatus = 'activo' | 'accion' | 'resuelto';
type Claim = {
  id: number;
  codigo: string;
  titulo: string;
  descripcion: string;
  estado: ClaimStatus;
  areaActual: string;
  actualizado: string;
  presentado: string;
  progreso: number; // 0..100
  prioridad: 'Alta' | 'Media' | 'Baja';
  agente: string;
  rolAgente: string;
  categoria: string;
  acuerdo: string;
  estRestante: string;
};

const LogoM = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6 20V4L12 14L18 4V20H15V12L12 16L9 12V20H6Z"
      fill="var(--color-primary)"
    />
  </svg>
);

function statusLabel(estado: ClaimStatus) {
  if (estado === 'activo') return 'Activo';
  if (estado === 'accion') return 'Acción requerida';
  return 'Resuelto';
}

function statusClasses(estado: ClaimStatus) {
  switch (estado) {
    case 'activo':
      return { pill: 'bg-blue-50 text-blue-700 border-blue-100', bar: 'bg-blue-500' };
    case 'accion':
      return { pill: 'bg-orange-50 text-orange-700 border-orange-100', bar: 'bg-orange-500' };
    case 'resuelto':
      return { pill: 'bg-emerald-50 text-emerald-700 border-emerald-100', bar: 'bg-emerald-500' };
  }
}

function ProgressRing({ value, caption }: { value: number; caption: string }) {
  const v = Math.max(0, Math.min(100, value));
  const background = `conic-gradient(var(--color-primary) ${v}%, #e5e7eb 0)`;
  return (
    <div className="relative w-20 h-20 shrink-0">
      <div className="absolute inset-0 rounded-full" style={{ background }} aria-hidden />
      <div className="absolute inset-[6px] rounded-full bg-white border border-[#e5e7eb] flex items-center justify-center">
        <div className="text-center leading-tight">
          <div className="text-lg font-extrabold text-[#111827]">{v}%</div>
          <div className="text-[10px] font-bold tracking-wider text-[#6b7280] uppercase">
            {caption}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UserDashboard() {
  const navigate = useNavigate();

  const [tab, setTab] = useState<'todos' | 'activos' | 'resueltos'>('todos');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(9402);

  const claims: Claim[] = useMemo(
    () => [
      {
        id: 9402,
        codigo: 'CLM-9402',
        titulo: 'Solicitud de reembolso demorada',
        descripcion:
          'Reclamo por el retraso en el procesamiento de la transacción TXN-82931. El usuario solicita una escalación de prioridad según el acuerdo de nivel de servicio.',
        estado: 'activo',
        areaActual: 'Depto. Finanzas',
        actualizado: 'hace 2 horas',
        presentado: '12 oct 2023',
        progreso: 75,
        prioridad: 'Alta',
        agente: 'Sarah Jenkins',
        rolAgente: 'Auditoría senior de finanzas',
        categoria: 'Facturación y reembolsos',
        acuerdo: 'Acuerdo de servicio v3',
        estRestante: 'Est. 2 días restantes',
      },
      {
        id: 8821,
        codigo: 'CLM-8821',
        titulo: 'Importe facturado incorrecto',
        descripcion:
          'Diferencia detectada entre el importe cobrado y el monto acordado. Se requiere verificación de soporte y conciliación.',
        estado: 'accion',
        areaActual: 'Verificación de soporte',
        actualizado: 'ayer',
        presentado: '10 oct 2023',
        progreso: 20,
        prioridad: 'Media',
        agente: 'Marco Díaz',
        rolAgente: 'Especialista de soporte',
        categoria: 'Facturación',
        acuerdo: 'Acuerdo de servicio v2',
        estRestante: 'Est. 5 días restantes',
      },
      {
        id: 7540,
        codigo: 'CLM-7540',
        titulo: 'Devolución por producto dañado',
        descripcion:
          'Se aprobó la devolución tras validar evidencia fotográfica y comprobante de compra. Caso finalizado.',
        estado: 'resuelto',
        areaActual: 'Cerrado',
        actualizado: 'hace 3 días',
        presentado: '02 oct 2023',
        progreso: 100,
        prioridad: 'Baja',
        agente: 'Lucía Pérez',
        rolAgente: 'Operaciones',
        categoria: 'Devoluciones',
        acuerdo: 'Acuerdo de servicio v3',
        estRestante: 'Finalizado',
      },
    ],
    [],
  );

  const filteredClaims = useMemo(() => {
    const q = query.trim().toLowerCase();
    return claims
      .filter((c) => {
        if (tab === 'activos') return c.estado !== 'resuelto';
        if (tab === 'resueltos') return c.estado === 'resuelto';
        return true;
      })
      .filter((c) => {
        if (!q) return true;
        return (
          c.codigo.toLowerCase().includes(q) ||
          c.titulo.toLowerCase().includes(q) ||
          c.areaActual.toLowerCase().includes(q)
        );
      });
  }, [claims, query, tab]);

  const selectedClaim = useMemo(
    () => claims.find((c) => c.id === selectedId) ?? filteredClaims[0],
    [claims, filteredClaims, selectedId],
  );

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-page)] text-[var(--color-text)]">
      {/* Top bar (estilo dashboard) */}
      <header className="sticky top-0 z-50 w-full border-b border-[#e5e7eb] bg-white">
        <div className="w-full px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-3">
              <LogoM />
              <span className="text-xl font-bold text-[#1f2937] hover:opacity-80">
                ClaimsApp
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link
                to="/user-dashboard"
                className="text-[#111827] font-semibold hover:text-[var(--color-primary)]"
              >
                Panel
              </Link>
              <a className="text-[#4b5563] hover:text-[var(--color-primary)]" href="#reclamos">
                Reclamos
              </a>
              <a
                className="text-[#4b5563] hover:text-[var(--color-primary)]"
                href="#documentos"
              >
                Documentos
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2">
              <span className="material-symbols-outlined text-[18px] text-[#6b7280]">
                search
              </span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-[240px] bg-transparent text-sm outline-none placeholder:text-[#9ca3af] text-[#111827]"
                placeholder="Buscar reclamos..."
                aria-label="Buscar reclamos"
              />
            </div>

            <Button
              text="Crear nuevo reclamo"
              color="primary"
              onClick={() => navigate('/create-reclamo')}
            />

            <button
              type="button"
              className="ml-1 w-10 h-10 rounded-full border border-[#e5e7eb] bg-white flex items-center justify-center text-[#6b7280] hover:border-[#d1d5db] hover:bg-[#f9fafb] transition-colors"
              aria-label="Cuenta"
            >
              <span className="material-symbols-outlined text-[20px]">person</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 flex min-h-0">
        <Sidebar title="Tus reclamos" initialOpen={true}>
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
                  { id: 'todos', label: 'Todos' },
                  { id: 'activos', label: 'Activos' },
                  { id: 'resueltos', label: 'Resueltos' },
                ] as const
              ).map((t) => {
                const isActive = tab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                      isActive
                        ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                        : 'bg-white text-[#4b5563] border-[#e5e7eb] hover:border-[#d1d5db] hover:bg-[#f9fafb]'
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>

            <div className="space-y-3" id="reclamos">
              {filteredClaims.map((c) => {
                const isSelected = selectedClaim?.id === c.id;
                const styles = statusClasses(c.estado);

                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedId(c.id)}
                    className={`w-full rounded-xl border text-left p-3 transition-colors ${
                      isSelected
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                        : 'border-[#e5e7eb] bg-white hover:bg-[#f9fafb]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider ${styles.pill}`}
                      >
                        {statusLabel(c.estado)}
                      </span>
                      <span className="text-[11px] text-[#9ca3af]">{c.actualizado}</span>
                    </div>

                    <p className="text-sm font-extrabold text-[#111827]">
                      #{c.codigo}: {c.titulo}
                    </p>
                    <p className="mt-0.5 text-xs text-[#6b7280]">
                      Actualmente en: <span className="font-semibold">{c.areaActual}</span>
                    </p>

                    <div className="mt-3">
                      <div className="h-2 rounded-full bg-[#e5e7eb] overflow-hidden">
                        <div
                          className={`h-2 ${styles.bar}`}
                          style={{ width: `${Math.max(0, Math.min(100, c.progreso))}%` }}
                        />
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[11px] text-[#6b7280]">
                        <span>{c.progreso}%</span>
                        <span className="text-[#9ca3af]">Progreso</span>
                      </div>
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
        </Sidebar>

        {/* Right content */}
        <section className="flex-1 min-h-0 overflow-y-auto px-4 py-6 md:px-8 lg:px-10">
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
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-3 py-1 text-[11px] font-extrabold tracking-wider uppercase">
                          Caso activo
                        </span>
                        <span className="text-xs text-[#6b7280]">
                          Presentado el {selectedClaim.presentado}
                        </span>
                      </div>

                      <h4 className="text-1xl md:text-3xl font-extrabold text-[#111827] tracking-tight">
                        Reclamo #{selectedClaim.codigo}: {selectedClaim.titulo}
                      </h4>
                      <p className="text-sm text-[#4b5563] leading-relaxed max-w-3xl">
                        {selectedClaim.descripcion}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 md:justify-end">
                      <ProgressRing value={selectedClaim.progreso} caption="resuelto" />
                      <div className="text-right">
                        <p className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">
                          {selectedClaim.estRestante}
                        </p>
                        <p className="text-xs text-[#9ca3af] mt-1">
                          Actualizado {selectedClaim.actualizado}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-5">
                    <p className="text-xs font-bold tracking-wider uppercase text-[#6b7280] mb-2">
                      Prioridad interna
                    </p>
                    <p className="text-lg font-extrabold text-[#111827]">
                      {selectedClaim.prioridad}
                    </p>
                    <p className="mt-2 text-xs text-orange-700">
                      <span className="font-extrabold">!</span> Escalar si se demora
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-5">
                    <p className="text-xs font-bold tracking-wider uppercase text-[#6b7280] mb-2">
                      Agente asignado
                    </p>
                    <p className="text-lg font-extrabold text-[#111827]">
                      {selectedClaim.agente}
                    </p>
                    <p className="mt-1 text-xs text-[var(--color-primary)] font-semibold">
                      {selectedClaim.rolAgente}
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-5">
                    <p className="text-xs font-bold tracking-wider uppercase text-[#6b7280] mb-2">
                      Categoría del caso
                    </p>
                    <p className="text-lg font-extrabold text-[#111827]">
                      {selectedClaim.categoria}
                    </p>
                    <p className="mt-1 text-xs text-[#6b7280]">{selectedClaim.acuerdo}</p>
                  </div>
                </div>

                {/* Traceability */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-6">
                  <h2 className="text-lg font-extrabold text-[#111827] mb-4">
                    Recorrido de trazabilidad
                  </h2>

                  <div className="relative">
                    <div className="absolute left-6 right-6 top-6 h-[3px] bg-[#e5e7eb]" aria-hidden />
                    <div className="grid grid-cols-5 gap-2">
                      {[
                        { label: 'Enviado', date: '12 oct', icon: 'task_alt', state: 'done' as const },
                        { label: 'Soporte', date: '13 oct', icon: 'support_agent', state: 'done' as const },
                        { label: 'Revisión legal', date: '15 oct', icon: 'gavel', state: 'done' as const },
                        { label: 'Finanzas', date: 'En curso', icon: 'account_balance', state: 'active' as const },
                        { label: 'Resuelto', date: 'Pendiente', icon: 'check_circle', state: 'pending' as const },
                      ].map((s, idx) => {
                        const circleClass =
                          s.state === 'done'
                            ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                            : s.state === 'active'
                            ? 'bg-white text-[var(--color-primary)] border-[var(--color-primary)]'
                            : 'bg-white text-[#9ca3af] border-[#e5e7eb]';

                        const labelClass =
                          s.state === 'active'
                            ? 'text-[var(--color-primary)]'
                            : s.state === 'done'
                            ? 'text-[#111827]'
                            : 'text-[#6b7280]';

                        return (
                          <div key={idx} className="flex flex-col items-center text-center">
                            <div
                              className={`relative z-10 w-12 h-12 rounded-full border flex items-center justify-center shadow-sm ${circleClass}`}
                            >
                              <span className="material-symbols-outlined text-[22px]">
                                {s.icon}
                              </span>
                            </div>
                            <p className={`mt-3 text-xs font-extrabold ${labelClass}`}>{s.label}</p>
                            <p className="text-[11px] text-[#9ca3af]">{s.date}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Activity */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-extrabold text-[#111827]">
                      Historial de actividad
                    </h2>
                    <a
                      href="#"
                      className="text-sm font-bold text-[var(--color-primary)] hover:opacity-80"
                    >
                      Descargar registro completo
                    </a>
                  </div>

                  <ol className="space-y-4">
                    {[
                      {
                        title: 'Transferido al Depto. Finanzas',
                        desc:
                          'Revisión legal finalizada. Caso derivado a Finanzas para cálculo de reembolso y aprobación de desembolso.',
                        time: 'Hoy, 10:45',
                      },
                      {
                        title: 'Verificación de documentación legal',
                        desc:
                          'Se finalizó la validación de la factura de compra y la documentación requerida.',
                        time: '15 oct, 14:20',
                      },
                      {
                        title: 'Reclamo inicializado',
                        desc:
                          'El sistema recibió el reclamo a través del portal y se generó el caso.',
                        time: '12 oct, 09:00',
                      },
                    ].map((e, idx) => (
                      <li key={idx} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <span className="mt-1 w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]" />
                          {idx !== 2 && <span className="flex-1 w-[2px] bg-[#e5e7eb] mt-2" />}
                        </div>
                        <div className="flex-1 pb-1">
                          <div className="flex items-start justify-between gap-4">
                            <p className="text-sm font-extrabold text-[#111827]">{e.title}</p>
                            <p className="text-xs text-[#9ca3af] whitespace-nowrap">{e.time}</p>
                          </div>
                          <p className="mt-1 text-sm text-[#4b5563] leading-relaxed">{e.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-end">
                  <Button text="Contactar agente" color="outline" onClick={() => {}} />
                  <Button text="Subir documentos" color="primary" onClick={() => {}} />
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
