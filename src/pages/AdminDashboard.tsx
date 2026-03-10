import React, { useMemo, useState, useEffect, useRef } from 'react';
import Button from '../components/Button';
import { LogoShield } from '../components/Icons';
import PreviewCharts from '../components/PreviewCharts';

import Navbar from '../components/Navbar';
import MenuDashboard, { type AdminView } from '../components/menuDashboard';

import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  BarController,
  DoughnutController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';

//Service
import { getReclamos } from '../service/reclamo.service';
import { getUsuarios } from '../service/usuarios.service';

//Interface
import {
  ReclamoI,
  FiltroEstado,
  FiltroPrioridad,
  FiltroCriticidad,
} from '../interfaces/reclamo.interface';
import { Usuario } from '../interfaces/usuarios.interface';


//context
import { statusPillClasses, priorityTextClasses } from '../context/functions';

ChartJS.register(
  ArcElement,
  BarElement,
  BarController,
  DoughnutController,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
);

type StatusChartData = {
  labels: string[];
  values: number[];
};

type PriorityChartData = {
  labels: string[];
  values: number[];
};

function StatusBarChart({ data }: { data: StatusChartData }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<ChartJS<'bar'> | null>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const chartData: ChartData<'bar'> = {
      labels: data.labels,
      datasets: [
        {
          label: 'Cantidad',
          data: data.values,
          backgroundColor: ['#fbbf24', '#3b82f6', '#10b981'],
          borderRadius: 12,
          maxBarThickness: 40,
        },
      ],
    };

    const options: ChartOptions<'bar'> = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#6b7280', font: { size: 11 } },
        },
        y: {
          grid: { color: '#e5e7eb' },
          ticks: { color: '#9ca3af', stepSize: 1, precision: 0 },
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: '#111827',
          padding: 8,
          cornerRadius: 8,
          displayColors: false,
        },
      },
    };

    chartRef.current = new ChartJS(ctx, {
      type: 'bar',
      data: chartData,
      options,
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [data]);

  return (
    <div className="h-40 md:h-56 lg:h-64">
      <canvas ref={canvasRef} />
    </div>
  );
}

function PriorityDoughnutChart({
  data,
  total,
}: {
  data: PriorityChartData;
  total: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<ChartJS<'doughnut'> | null>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const chartData: ChartData<'doughnut'> = {
      labels: data.labels,
      datasets: [
        {
          data: data.values,
          backgroundColor: ['#f97373', '#facc15', '#22c55e'],
          borderWidth: 0,
          hoverOffset: 6,
        },
      ],
    };

    const options: ChartOptions<'doughnut'> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: '#111827',
          padding: 8,
          cornerRadius: 8,
          callbacks: {
            label(context) {
              const label = String(context.label || '');
              const value = Number(context.parsed) || 0;
              const percent = total ? Math.round((value / total) * 100) : 0;
              return `${label}: ${value} (${percent}%)`;
            },
          },
        },
      },
      cutout: '65%',
    };

    chartRef.current = new ChartJS(ctx, {
      type: 'doughnut',
      data: chartData,
      options,
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [data, total]);

  return (
    <div className="w-40 h-40">
      <canvas ref={canvasRef} />
    </div>
  );
}

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const [cantReclamos, setAmount] = useState(0)
  const [claimsIniciados, setClaimsStatus] = useState(0)
  const [claimsAssigned, setClaimsAssigned] = useState(0)
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [claims, setClaims] = useState<ReclamoI[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [isLastPage, setIsLastPage] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<ReclamoI | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<FiltroEstado>('Todos');
  const [areaFilter, setAreaFilter] = useState<'Todas las áreas' | 'Soporte' | 'Finanzas'>(
    'Todas las áreas',
  );
  const [priorityFilter, setPriorityFilter] = useState<FiltroPrioridad>('Todas');
  const [criticidadFilter, setCriticidadFilter] = useState<FiltroCriticidad>('Todas');
  const [usuariosPage, setUsuariosPage] = useState(1);
  const [usuariosPerPage] = useState(8);

  const paginatedUsuarios = useMemo(() => {
    const start = (usuariosPage - 1) * usuariosPerPage;
    return usuarios.slice(start, start + usuariosPerPage);
  }, [usuarios, usuariosPage, usuariosPerPage]);

  const totalUsuariosPages = Math.ceil(usuarios.length / usuariosPerPage);

  const filteredClaims = useMemo(() => {
    return claims.filter((r) => {
      const estadoNombre = r.estado?.nombre ?? '';
      const prioridad = r.prioridad ?? '';
      const criticidad = r.criticidad ?? '';

      if (statusFilter !== 'Todos' && estadoNombre.toLowerCase() !== statusFilter.toLowerCase()) return false;
      if (priorityFilter !== 'Todas' && prioridad.toLowerCase() !== priorityFilter.toLowerCase()) return false;
      if (criticidadFilter !== 'Todas' && criticidad.toLowerCase() !== criticidadFilter.toLowerCase()) return false;

      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        r._id.toLowerCase().includes(q) ||
        (r.nameUsuario ?? '').toLowerCase().includes(q) ||
        String(r.idUsuario ?? '').toLowerCase().includes(q)
      );
    });
  }, [claims, search, statusFilter, priorityFilter, criticidadFilter]);

  const analytics = useMemo(() => {
    const source = claims;

    const byStatus: Record<string, number> = {
      Iniciada: 0,
      'En Proceso': 0,
      Resuelta: 0,
    };

    const byPriority: Record<string, number> = {
      Alta: 0,
      Media: 0,
      Baja: 0,
    };

    source.forEach((r) => {
      const estadoNombre = r.estado?.nombre;
      const prioridad = r.prioridad;
      if (estadoNombre && byStatus[estadoNombre] !== undefined) {
        byStatus[estadoNombre]++;
      }
      if (prioridad && byPriority[prioridad] !== undefined) {
        byPriority[prioridad]++;
      }
    });

    const total = source.length || 1;
    const statusSeries = Object.keys(byStatus).map((k) => ({
      label: k,
      value: byStatus[k],
      percent: Math.round((byStatus[k] / total) * 100),
    }));

    const prioritySeries = Object.keys(byPriority).map((k) => ({
      label: k,
      value: byPriority[k],
      percent: Math.round((byPriority[k] / total) * 100),
    }));

    return { statusSeries, prioritySeries };
  }, [claims]);

  const statusChartData = useMemo<StatusChartData>(
    () => ({
      labels: analytics.statusSeries.map((s) => s.label),
      values: analytics.statusSeries.map((s) => s.value),
    }),
    [analytics],
  );

  const priorityChartData = useMemo<PriorityChartData>(
    () => ({
      labels: analytics.prioritySeries.map((p) => p.label),
      values: analytics.prioritySeries.map((p) => p.value),
    }),
    [analytics],
  );

  useEffect(() => {
    const obtenerReclamos = async () => {
      try {
        const data = await getReclamos(currentPage, limit);

        const reclamos: ReclamoI[] = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
            ? data
            : [];
        // console.log(reclamos)

        setAmount(reclamos.length);

        // Reclamos en estado 'Iniciada' (según JSON del backend)
        setClaimsStatus(
          reclamos.filter((r) => r.estado?.nombre === 'Iniciada').length,
        );

        setClaimsAssigned(
          reclamos.filter((r) => r.estado?.nombre === 'Resuelta').length,
        );

        setClaims(reclamos);
        setIsLastPage(reclamos.length < limit);
      } catch (error) {
        console.error('Error fetching reclamos:', error);
      }
    };

    obtenerReclamos();
  }, [currentPage, limit]);

  useEffect(() => {
    const obtenerUsuarios = async () => {
      const data: Usuario[] = await getUsuarios();
      setUsuarios(data);
    };
    obtenerUsuarios();
  }, []);

  return (
    <>
      <div className="min-h-screen flex overflow-hidden bg-[#f3f4f6] text-[#111827]">
        <MenuDashboard
          variant="admin"
          activeView={activeView}
          onViewChange={setActiveView}
        />

        {/* Main content */}
        <main className="flex-1 min-h-0 min-w-0 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6 space-y-6">
            {/* Header dinámico */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h4 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#111827]">
                  {activeView === 'dashboard' && 'Resumen de reclamos'}
                  {activeView === 'reclamos' && 'Lista de reclamos'}
                  {activeView === 'graficos' && 'Analytics'}
                  {activeView === 'usuarios' && 'Gestión de usuarios'}
                </h4>
                <p className="mt-1 text-sm text-[#6b7280] max-w-xl">
                  {activeView === 'dashboard' &&
                    'Gestioná, revisá y resolvé los reclamos formales de clientes desde un único panel.'}
                  {activeView === 'reclamos' &&
                    'Explorá y filtrá todos los reclamos registrados en el sistema.'}
                  {activeView === 'graficos' &&
                    'Visualizá la distribución de reclamos por estado y prioridad.'}
                  {activeView === 'usuarios' &&
                    'Administrá los usuarios y sus permisos en el sistema.'}
                </p>
              </div>

            </div>

            {/* Vista Usuarios - tabla con paginador */}
            {activeView === 'usuarios' && (
              <section className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead className="bg-[#f9fafb] border-b border-[#e5e7eb]">
                      <tr>
                        <th className="px-5 py-4 text-xs font-bold tracking-wider uppercase text-[#6b7280]">
                          Usuario
                        </th>
                        <th className="px-5 py-4 text-xs font-bold tracking-wider uppercase text-[#6b7280]">
                          Email
                        </th>
                        <th className="px-5 py-4 text-xs font-bold tracking-wider uppercase text-[#6b7280]">
                          Roles
                        </th>
                        <th className="px-5 py-4 text-xs font-bold tracking-wider uppercase text-[#6b7280]">
                          Fecha de creación
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e5e7eb]">
                      {paginatedUsuarios.map((usuario) => (
                        <tr
                          key={usuario._id}
                          className="hover:bg-[#f9fafb] transition-colors duration-150"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                                {usuario.fullName
                                  ? usuario.fullName
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')
                                    .slice(0, 2)
                                    .toUpperCase()
                                  : usuario.email[0].toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-[#111827]">
                                  {usuario.fullName || '—'}
                                </p>
                                <p className="text-xs text-[#9ca3af]">ID: {usuario._id.slice(-8)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-sm text-[#4b5563]">{usuario.email}</span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex flex-wrap gap-1.5">
                              <span>{usuario.roles}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-sm text-[#4b5563]">
                              {new Date(usuario.createdAt).toLocaleDateString('es-AR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                              })}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {usuarios.length === 0 ? (
                  <div className="py-16 text-center">
                    <span className="material-symbols-outlined text-5xl text-[#e5e7eb]">group</span>
                    <p className="mt-2 text-sm font-medium text-[#6b7280]">No hay usuarios</p>
                    <p className="text-xs text-[#9ca3af]">Los usuarios aparecerán aquí cuando se registren.</p>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-[#e5e7eb] bg-[#f9fafb]">
                    <p className="text-xs text-[#6b7280]">
                      Mostrando{' '}
                      <span className="font-semibold text-[#111827]">
                        {((usuariosPage - 1) * usuariosPerPage) + 1} a{' '}
                        {Math.min(usuariosPage * usuariosPerPage, usuarios.length)}
                      </span>{' '}
                      de {usuarios.length} usuarios
                    </p>
                    <div className="inline-flex items-center gap-0.5 rounded-xl border border-[#e5e7eb] bg-white p-1 shadow-sm">
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-lg text-sm font-medium text-[#4b5563] hover:bg-[#f3f4f6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        disabled={usuariosPage === 1}
                        onClick={() => setUsuariosPage((p) => Math.max(1, p - 1))}
                      >
                        Anterior
                      </button>
                      <div className="flex items-center gap-0.5 px-1">
                        {Array.from({ length: Math.min(5, totalUsuariosPages) }, (_, i) => {
                          let page: number;
                          if (totalUsuariosPages <= 5) {
                            page = i + 1;
                          } else if (usuariosPage <= 3) {
                            page = i + 1;
                          } else if (usuariosPage >= totalUsuariosPages - 2) {
                            page = totalUsuariosPages - 4 + i;
                          } else {
                            page = usuariosPage - 2 + i;
                          }
                          return (
                            <button
                              key={page}
                              type="button"
                              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${page === usuariosPage
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-[#6b7280] hover:bg-[#f3f4f6]'
                                }`}
                              onClick={() => setUsuariosPage(page)}
                            >
                              {page}
                            </button>
                          );
                        })}
                      </div>
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-lg text-sm font-medium text-[#4b5563] hover:bg-[#f3f4f6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        disabled={usuariosPage >= totalUsuariosPages}
                        onClick={() => setUsuariosPage((p) => Math.min(totalUsuariosPages, p + 1))}
                      >
                        Siguiente
                      </button>
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Metrics cards - solo en dashboard */}
            {(activeView === 'dashboard') && (
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <article className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-bold tracking-wider uppercase text-[#6b7280]">
                      Reclamos totales
                    </p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[11px] font-semibold">
                      <span className="material-symbols-outlined text-[16px]">trending_up</span>
                    </span>
                  </div>
                  <p className="text-2xl font-extrabold text-[#111827]">{cantReclamos}</p>
                </article>

                <article className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-4 flex flex-col justify-between">
                  <p className="text-xs font-bold tracking-wider uppercase text-[#6b7280] mb-2">
                    Reclamos sin asignar
                  </p>
                  <p className="text-2xl font-extrabold text-[#111827]">{claimsIniciados}</p>
                  <p className="mt-1 text-xs text-[#9ca3af]">Requieren asignación</p>
                </article>

                <article className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-4 flex flex-col justify-between">
                  <p className="text-xs font-bold tracking-wider uppercase text-[#6b7280] mb-2">
                    Reclamos Finalizados
                  </p>
                  <p className="text-2xl font-extrabold text-[#111827]">{claimsAssigned}</p>
                </article>

              </section>
            )}

            {/* Filters row - dashboard y reclamos */}
            {(activeView === 'dashboard') && (
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
                        onChange={(e) => setStatusFilter(e.target.value as FiltroEstado)}
                        className="rounded-lg border border-[#e5e7eb] bg-white px-2 py-1 text-xs text-[#111827]"
                      >
                        <option value="Todos">Todos</option>
                        <option value="Iniciada">Iniciada</option>
                        <option value="En proceso">En proceso</option>
                        <option value="Resuelta">Resuelta</option>
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
                        onChange={(e) => setPriorityFilter(e.target.value as FiltroPrioridad)}
                        className="rounded-lg border border-[#e5e7eb] bg-white px-2 py-1 text-xs text-[#111827]"
                      >
                        <option value="Todas">Todas</option>
                        <option value="Alta">Alta</option>
                        <option value="Media">Media</option>
                        <option value="Baja">Baja</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#6b7280]">  
                      <span>Criticidad:</span>
                      <select
                        value={criticidadFilter}
                        onChange={(e) => setCriticidadFilter(e.target.value as FiltroCriticidad)}
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
                        <th className="px-4 py-2">Usuario</th>
                        <th className="px-4 py-2">Estado</th>
                        <th className="px-4 py-2">Prioridad</th>
                        <th className="px-4 py-2">Criticidad</th>
                        <th className="px-4 py-2">Fecha</th>
                        <th className="px-4 py-2 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredClaims.map((r) => (
                        <tr key={r._id}>
                          <td className="px-4 py-2">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#e5e7eb] flex items-center justify-center text-xs font-semibold text-[#4b5563]">
                                {(r.nameUsuario ?? '?')
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-[#111827]">{r.nameUsuario}</p>
                                <p className="text-xs text-[#6b7280]">{r.emailUsuario}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-2">
                            <span
                              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${statusPillClasses(
                                r.estado?.nombre ?? '',
                              )}`}
                            >
                              {r.estado?.nombre}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <span
                              className={`text-xs font-semibold uppercase tracking-wide ${priorityTextClasses(
                                r.prioridad ?? '',
                              )}`}
                            >
                              {r.prioridad ?? '—'}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                          <span
                              className={`text-xs font-semibold uppercase tracking-wide ${priorityTextClasses(
                                r.criticidad ?? '',
                              )}`}
                            >
                              {r.criticidad ?? '—'}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <span className="text-xs text-[#6b7280]">
                              {new Date(r.fechaHoraInicio).toLocaleDateString('es-AR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                              })}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex items-center justify-end gap-2 text-[#6b7280]">
                              <button
                                type="button"
                                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#f3f4f6]"
                                aria-label="Ver detalle"
                                title="Ver detalle"
                                onClick={() => setSelectedClaim(r)}
                              >
                                <span className="material-symbols-outlined text-[18px]">
                                  visibility
                                </span>
                              </button>
                              <button
                                type="button"
                                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#f3f4f6]"
                                aria-label="Ver trazabilidad"
                                title="Ver trazabilidad"
                              >
                                <span className="material-symbols-outlined text-[18px]">
                                  timeline
                                </span>
                              </button>
                              <button
                                type="button"
                                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#f3f4f6]"
                                aria-label="Asignar"
                                title="Asignar"
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
                    {cantReclamos} reclamos
                  </p>

                  <div className="inline-flex items-center gap-1 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-1 py-1 text-xs font-medium text-[#4b5563]">
                    <button
                      type="button"
                      className="px-2 py-1 rounded-lg hover:bg-white disabled:opacity-50"
                      disabled={currentPage === 1}
                      onClick={() => {
                        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
                      }}
                    >
                      Anterior
                    </button>
                    {[1, 2, 3].map((page) => (
                      <button
                        key={page}
                        type="button"
                        className={`w-7 h-7 rounded-lg text-center ${page === currentPage
                          ? 'bg-white shadow-sm text-[var(--color-primary)]'
                          : 'hover:bg-white'
                          }`}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="px-2 py-1 rounded-lg hover:bg-white disabled:opacity-50"
                      disabled={isLastPage}
                      onClick={() => {
                        if (!isLastPage) setCurrentPage((prev) => prev + 1);
                      }}
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* Analytics - dashboard y gráficos */}
            {(activeView === 'graficos') && (
              <section className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <h2 className="text-lg md:text-xl font-extrabold text-[#111827]">
                      Analíticas de reclamos
                    </h2>
                    <p className="mt-1 text-xs md:text-sm text-[#6b7280]">
                      Distribución visual de los reclamos por estado y prioridad (página actual).
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#6b7280]">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#f3f4ff] text-[#3730a3] px-2 py-0.5 font-semibold">
                      <span className="material-symbols-outlined text-[16px]">insights</span>
                      Vista analítica
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Status bar chart */}
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-xs font-bold tracking-wider uppercase text-[#6b7280]">
                      Reclamos por estado
                    </h3>
                    <div className="bg-[#f9fafb] rounded-2xl border border-[#e5e7eb] p-4">
                      <StatusBarChart data={statusChartData} />
                    </div>
                  </div>

                  {/* Priority doughnut chart */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold tracking-wider uppercase text-[#6b7280]">
                      Prioridad de reclamos
                    </h3>
                    <div className="bg-[#f9fafb] rounded-2xl border border-[#e5e7eb] p-4 flex flex-col items-center justify-center gap-3">
                      <PriorityDoughnutChart
                        data={priorityChartData}
                        total={
                          analytics.prioritySeries.reduce((acc, item) => acc + item.value, 0) || 0
                        }
                      />
                      <div className="text-center space-y-1">
                        <p className="text-xs font-semibold text-[#111827]">
                          Total página actual
                        </p>
                        <p className="text-[11px] text-[#6b7280]">
                          {claims.length || 0} reclamos distribuidos por prioridad.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </main>
      </div>

      {/* Modal de preview de reclamo */}
      <PreviewCharts
        claim={selectedClaim}
        onClose={() => setSelectedClaim(null)}
        onStatusChange={(claimId, newStatus, resolucion) => {
          // Actualizar el estado.nombre en la lista local
          setClaims((prev) =>
            prev.map((r) =>
              r._id === claimId
                ? { ...r, estado: { ...r.estado, nombre: newStatus } }
                : r,
            ),
          );
        }}
      />
    </>
  );
}
