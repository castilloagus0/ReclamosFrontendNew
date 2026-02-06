import React, { useMemo, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Button from '../components/Button';

type ClaimPriority = 'Alta' | 'Media' | 'Baja';
type ClaimStatus = 'Pendiente' | 'En progreso' | 'Resuelto';

type ClaimRow = {
  id: string;
  user: string;
  email: string;
  status: ClaimStatus;
  priority: ClaimPriority;
  date: string;
};

const claimsMock: ClaimRow[] = [
  {
    id: '#CLM-2084',
    user: 'John Doe',
    email: 'j.doe@example.com',
    status: 'Pendiente',
    priority: 'Alta',
    date: '24 oct 2023',
  },
  {
    id: '#CLM-2085',
    user: 'Sarah Adams',
    email: 's.adams@cloud.com',
    status: 'En progreso',
    priority: 'Media',
    date: '23 oct 2023',
  },
  {
    id: '#CLM-2086',
    user: 'Mike Kelly',
    email: 'm.kelly@service.io',
    status: 'Resuelto',
    priority: 'Baja',
    date: '22 oct 2023',
  },
];

function statusPillClasses(status: ClaimStatus) {
  switch (status) {
    case 'Pendiente':
      return 'bg-amber-50 text-amber-700 border-amber-100';
    case 'En progreso':
      return 'bg-blue-50 text-blue-700 border-blue-100';
    case 'Resuelto':
      return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-100';
  }
}

function priorityTextClasses(priority: ClaimPriority) {
  switch (priority) {
    case 'Alta':
      return 'text-rose-600';
    case 'Media':
      return 'text-amber-600';
    case 'Baja':
      return 'text-emerald-600';
    default:
      return 'text-gray-600';
  }
}

const LogoShield = ({ className = 'w-8 h-8' }: { className?: string }) => (
  <div className="flex items-center justify-center rounded-2xl bg-[var(--color-primary)]/10">
    <span className={`material-symbols-outlined text-[var(--color-primary)] ${className}`}>
      verified_user
    </span>
  </div>
);

export default function AdminDashboard() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | ClaimStatus>('Todos');
  const [areaFilter, setAreaFilter] = useState<'Todas las áreas' | 'Soporte' | 'Finanzas'>(
    'Todas las áreas',
  );
  const [priorityFilter, setPriorityFilter] = useState<'Todas' | ClaimPriority>('Todas');

  const filteredClaims = useMemo(() => {
    return claimsMock.filter((claim) => {
      if (statusFilter !== 'Todos' && claim.status !== statusFilter) return false;
      if (priorityFilter !== 'Todas' && claim.priority !== priorityFilter) return false;

      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        claim.id.toLowerCase().includes(q) ||
        claim.user.toLowerCase().includes(q) ||
        claim.email.toLowerCase().includes(q)
      );
    });
  }, [search, statusFilter, priorityFilter]);

  return (
    <div className="min-h-screen flex bg-[#f3f4f6] text-[#111827]">
      {/* Sidebar admin */}
      <Sidebar
        userType="admin"
        title="Panel de reclamos"
        initialOpen={true}
        className="hidden md:block"
      >
        <div className="space-y-6 pt-2">
          <div className="flex items-center gap-3 px-1">
            <LogoShield className="text-[26px]" />
            <div>
              <p className="text-sm font-bold text-[#111827]">Panel de reclamos</p>
              <p className="text-[11px] uppercase tracking-wider text-[#9ca3af]">
                Enterprise v2.4
              </p>
            </div>
          </div>

          <nav className="space-y-1 text-sm">
            {[
              { icon: 'dashboard', label: 'Dashboard', active: true },
              { icon: 'fact_check', label: 'Listado de reclamos', active: false },
              { icon: 'monitoring', label: 'Analíticas', active: false },
              { icon: 'group', label: 'Usuarios', active: false },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                className={`w-full flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                  item.active
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'text-[#4b5563] hover:bg-[#f3f4f6]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="pt-4 mt-4 border-t border-[#e5e7eb] space-y-3">
            <button
              type="button"
              className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-[#4b5563] hover:bg-[#f3f4f6]"
            >
              <span className="inline-flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">settings</span>
                <span>Configuración</span>
              </span>
              <span className="text-[10px] rounded-full bg-[#e5e7eb] px-2 py-0.5">Admin</span>
            </button>

            <div className="flex items-center gap-3 rounded-xl bg-[#f9fafb] px-3 py-3">
              <div className="w-9 h-9 rounded-full bg-[#e5e7eb] flex items-center justify-center text-xs font-bold text-[#4b5563]">
                AR
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-[#111827]">Alex Rivera</p>
                <p className="text-[11px] text-[#6b7280]">Administrador del sistema</p>
              </div>
              <span className="material-symbols-outlined text-[18px] text-[#9ca3af]">
                expand_more
              </span>
            </div>
          </div>
        </div>
      </Sidebar>

      {/* Main content */}
      <main className="flex-1 min-h-0 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h4 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#111827]">
                Resumen de reclamos
              </h4>
              <p className="mt-1 text-sm text-[#6b7280] max-w-xl">
                Gestioná, revisá y resolvé los reclamos formales de clientes desde un único panel.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                text="Exportar reporte"
                color="outline"
                className="!px-4 !py-2 text-sm"
                icon={<span className="material-symbols-outlined text-[18px]">download</span>}
              />
              <Button
                text="Nuevo reclamo manual"
                color="primary"
                className="!px-4 !py-2 text-sm"
                icon={<span className="material-symbols-outlined text-[18px]">add</span>}
              />
            </div>
          </div>

          {/* Metrics cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <article className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold tracking-wider uppercase text-[#6b7280]">
                  Reclamos totales
                </p>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[11px] font-semibold">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                  +12%
                </span>
              </div>
              <p className="text-2xl font-extrabold text-[#111827]">1,284</p>
              <p className="mt-1 text-xs text-[#9ca3af]">Últimos 30 días</p>
            </article>

            <article className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-4 flex flex-col justify-between">
              <p className="text-xs font-bold tracking-wider uppercase text-[#6b7280] mb-2">
                Tiempo medio de resolución
              </p>
              <p className="text-2xl font-extrabold text-[#111827]">4.2 Days</p>
              <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-rose-50 text-rose-700 px-2 py-0.5 text-[11px] font-semibold w-fit">
                <span className="material-symbols-outlined text-[16px]">trending_down</span>
                -5%
              </p>
            </article>

            <article className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-4 flex flex-col justify-between">
              <p className="text-xs font-bold tracking-wider uppercase text-[#6b7280] mb-2">
                Reclamos sin asignar
              </p>
              <p className="text-2xl font-extrabold text-[#111827]">18</p>
              <p className="mt-1 text-xs text-[#9ca3af]">Requieren asignación</p>
            </article>

            <article className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-4 flex flex-col justify-between">
              <p className="text-xs font-bold tracking-wider uppercase text-[#6b7280] mb-2">
                Incumplimientos de SLA
              </p>
              <p className="text-2xl font-extrabold text-[#111827]">3</p>
              <p className="mt-1 text-xs text-[#9ca3af]">Últimos 7 días</p>
            </article>
          </section>

          {/* Filters row */}
          <section className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-4 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
              <div className="flex-1 flex items-center gap-2 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2">
                <span className="material-symbols-outlined text-[18px] text-[#6b7280]">
                  search
                </span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none placeholder:text-[#9ca3af] text-[#111827]"
                  placeholder="Buscar reclamos por ID, usuario o palabras clave..."
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 text-xs text-[#6b7280]">
                  <span>Estado:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(e.target.value as 'Todos' | ClaimStatus)
                    }
                    className="rounded-lg border border-[#e5e7eb] bg-white px-2 py-1 text-xs text-[#111827]"
                  >
                    <option value="Todos">Todos</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="En progreso">En progreso</option>
                    <option value="Resuelto">Resuelto</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#6b7280]">
                  <span>Área:</span>
                  <select
                    value={areaFilter}
                    onChange={(e) =>
                      setAreaFilter(
                        e.target.value as 'Todas las áreas' | 'Soporte' | 'Finanzas',
                      )
                    }
                    className="rounded-lg border border-[#e5e7eb] bg-white px-2 py-1 text-xs text-[#111827]"
                  >
                    <option value="Todas las áreas">Todas las áreas</option>
                    <option value="Soporte">Soporte</option>
                    <option value="Finanzas">Finanzas</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#6b7280]">
                  <span>Prioridad:</span>
                  <select
                    value={priorityFilter}
                    onChange={(e) =>
                      setPriorityFilter(e.target.value as 'Todas' | ClaimPriority)
                    }
                    className="rounded-lg border border-[#e5e7eb] bg-white px-2 py-1 text-xs text-[#111827]"
                  >
                    <option value="Todas">Todas</option>
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto -mx-4 -mb-4 md:mx-0 md:mb-0">
              <table className="min-w-full text-left border-separate border-spacing-y-2 px-4 md:px-0">
                <thead>
                  <tr className="text-xs font-semibold text-[#6b7280]">
                    <th className="px-4 py-2">ID reclamo</th>
                    <th className="px-4 py-2">Usuario</th>
                    <th className="px-4 py-2">Estado</th>
                    <th className="px-4 py-2">Prioridad</th>
                    <th className="px-4 py-2">Fecha</th>
                    <th className="px-4 py-2 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClaims.map((claim) => (
                    <tr key={claim.id}>
                      <td className="px-4 py-2">
                        <span className="text-xs font-semibold text-[#6b7280]">
                          {claim.id}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#e5e7eb] flex items-center justify-center text-xs font-semibold text-[#4b5563]">
                            {claim.user
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#111827]">{claim.user}</p>
                            <p className="text-xs text-[#6b7280]">{claim.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusPillClasses(
                            claim.status,
                          )}`}
                        >
                          {claim.status}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`text-xs font-semibold uppercase tracking-wide ${priorityTextClasses(
                            claim.priority,
                          )}`}
                        >
                          {claim.priority}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className="text-xs text-[#6b7280]">{claim.date}</span>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex items-center justify-end gap-2 text-[#6b7280]">
                          <button
                            type="button"
                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#f3f4f6]"
                            aria-label="Ver detalle"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              visibility
                            </span>
                          </button>
                          <button
                            type="button"
                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#f3f4f6]"
                            aria-label="Ver trazabilidad"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              timeline
                            </span>
                          </button>
                          <button
                            type="button"
                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#f3f4f6]"
                            aria-label="Asignar"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              group_add
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredClaims.length === 0 && (
                <div className="px-4 py-6 text-center text-sm text-[#6b7280]">
                  No hay reclamos que coincidan con los filtros actuales.
                </div>
              )}
            </div>

            {/* Pagination footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#e5e7eb] mt-2">
              <p className="text-xs text-[#6b7280]">
                Mostrando <span className="font-semibold">1 a {filteredClaims.length}</span> de{' '}
                {claimsMock.length} reclamos
              </p>

              <div className="inline-flex items-center gap-1 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-1 py-1 text-xs font-medium text-[#4b5563]">
                <button
                  type="button"
                  className="px-2 py-1 rounded-lg hover:bg-white disabled:opacity-50"
                  disabled
                >
                  Anterior
                </button>
                {[1, 2, 3].map((page) => (
                  <button
                    key={page}
                    type="button"
                    className={`w-7 h-7 rounded-lg text-center ${
                      page === 1 ? 'bg-white shadow-sm text-[var(--color-primary)]' : 'hover:bg-white'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  className="px-2 py-1 rounded-lg hover:bg-white"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
