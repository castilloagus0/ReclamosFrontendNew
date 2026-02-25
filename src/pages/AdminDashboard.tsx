import React, { useMemo, useState, useEffect, useRef } from 'react';
import Button from '../components/Button';
import { LogoShield } from '../components/Icons';

import Navbar from '../components/Navbar';

import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';

//Service
import { getReclamos } from '../service/reclamo.service';

//Interface
import { ReclamoI, ClaimRow, ClaimPriority, ClaimStatus } from '../interfaces/reclamo.interface';


//context
import { statusPillClasses, priorityTextClasses } from '../context/functions';



function mapEstadoToClaimStatus(nombreEstado: string): ClaimStatus {
  const normalized = nombreEstado.toLowerCase();

  if (normalized === 'iniciado' || normalized === 'iniciada' || normalized === 'pendiente') {
    return 'Pendiente';
  }

  if (normalized === 'en progreso' || normalized === 'en proceso' || normalized === 'en curso') {
    return 'En progreso';
  }

  return 'Resuelto';
}

function mapPrioridadToClaimPriority(prioridad: string | null): ClaimPriority {
  if (!prioridad) return 'Media';

  const normalized = prioridad.toLowerCase();

  if (normalized === 'alta') return 'Alta';
  if (normalized === 'baja') return 'Baja';

  return 'Media';
}

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

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
  const [cantReclamos, setAmount] = useState(0)
  const [claimsIniciados, setClaimsStatus] = useState(0)
  const [claims, setClaims] = useState<ClaimRow[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [isLastPage, setIsLastPage] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | ClaimStatus>('Todos');
  const [areaFilter, setAreaFilter] = useState<'Todas las áreas' | 'Soporte' | 'Finanzas'>(
    'Todas las áreas',
  );
  const [priorityFilter, setPriorityFilter] = useState<'Todas' | ClaimPriority>('Todas');

  const filteredClaims = useMemo(() => {
    return claims.filter((claim) => {
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
  }, [claims, search, statusFilter, priorityFilter]);

  const analytics = useMemo(() => {
    const source = filteredClaims;
    const total = source.length || 1;

    const byStatus: Record<ClaimStatus, number> = {
      Pendiente: 0,
      'En progreso': 0,
      Resuelto: 0,
    };

    const byPriority: Record<ClaimPriority, number> = {
      Alta: 0,
      Media: 0,
      Baja: 0,
    };

    source.forEach((c) => {
      byStatus[c.status] = (byStatus[c.status] ?? 0) + 1;
      byPriority[c.priority] = (byPriority[c.priority] ?? 0) + 1;
    });

    const statusSeries = (Object.keys(byStatus) as ClaimStatus[]).map((k) => ({
      label: k,
      value: byStatus[k],
      percent: Math.round((byStatus[k] / total) * 100),
    }));

    const prioritySeries = (Object.keys(byPriority) as ClaimPriority[]).map((k) => ({
      label: k,
      value: byPriority[k],
      percent: Math.round((byPriority[k] / total) * 100),
    }));

    return { statusSeries, prioritySeries };
  }, [filteredClaims]);


  useEffect(() => {
    const obtenerReclamos = async () => {
      try {
        const data = await getReclamos(currentPage, limit);

        const reclamos: ReclamoI[] = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data)
          ? data
          : [];

        console.log("reclamos", reclamos)

        const totalFromResponse =
          typeof data?.total === 'number'
            ? data.total
            : typeof data?.totalDocs === 'number'
            ? data.totalDocs
            : reclamos.length;

        setAmount(totalFromResponse);

        setClaimsStatus(
          reclamos.filter(
            (r) =>
              r.estado?.nombre === 'Iniciado' ||
              r.estado?.nombre === 'Iniciada' ||
              r.estado?.nombre?.toLowerCase() === 'pendiente',
          ).length,
        );

        const mappedClaims: ClaimRow[] = reclamos.map((r) => ({
          id: r._id,
          user: r.nameUsuario,
          email: String(r.idUsuario ?? ''),
          status: mapEstadoToClaimStatus(r.estado?.nombre ?? ''),
          priority: mapPrioridadToClaimPriority(r.prioridad),
          date: new Date(r.fechaHoraInicio).toLocaleDateString('es-AR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          }),
        }));

        setClaims(mappedClaims);
        setIsLastPage(reclamos.length < limit);
      } catch (error) {
        console.error('Error fetching reclamos:', error);
      }
    };

    obtenerReclamos();
  }, [currentPage, limit]);

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex bg-[#f3f4f6] text-[#111827]">
        {/* Sidebar admin */}

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
                  </span>
                </div>
                <p className="text-2xl font-extrabold text-[#111827]">{cantReclamos}</p>
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
                <p className="text-2xl font-extrabold text-[#111827]">{claimsIniciados}</p>
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
                      className={`w-7 h-7 rounded-lg text-center ${
                        page === currentPage
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

            {/* Analytics */}
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
                    <StatusBarChart
                      data={{
                        labels: analytics.statusSeries.map((s) => s.label),
                        values: analytics.statusSeries.map((s) => s.value),
                      }}
                    />
                  </div>
                </div>

                {/* Priority doughnut chart */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold tracking-wider uppercase text-[#6b7280]">
                    Prioridad de reclamos
                  </h3>
                  <div className="bg-[#f9fafb] rounded-2xl border border-[#e5e7eb] p-4 flex flex-col items-center justify-center gap-3">
                    <PriorityDoughnutChart
                      data={{
                        labels: analytics.prioritySeries.map((p) => p.label),
                        values: analytics.prioritySeries.map((p) => p.value),
                      }}
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
          </div>
        </main>
      </div>
    </div>
  );
}
