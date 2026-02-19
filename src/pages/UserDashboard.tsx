import React, { useMemo, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useLoading } from '../context/LoadingContext'; 
import Button from '../components/Button';
import Sidebar from '../components/Sidebar';

import { toast } from 'sonner';

import { getReclamosByUser } from '../service/reclamo.service';
import { ReclamoI } from '../interfaces/reclamo.interface'


const LogoM = ({ className = 'w-6 h-6' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6 20V4L12 14L18 4V20H15V12L12 16L9 12V20H6Z"
      fill="var(--color-primary)"
    />
  </svg>
);

export default function UserDashboard() {
  const navigate = useNavigate();

  const [tab, setTab] = useState<'todos' | 'activos' | 'resueltos'>('todos');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reclamos, setReclamos] = useState<ReclamoI[]>([]);

  const { setLoading } = useLoading();

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
                const isSelected = selectedClaim?._id === c._id;
                const fecha = new Date(c.fechaHoraInicio).toLocaleDateString('es-AR');

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
                      <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-blue-700 border-blue-100">
                        {c.estado?.nombre || 'Sin estado'}
                      </span>
                      <span className="text-[11px] text-[#9ca3af]">{fecha}</span>
                    </div>

                    <p className="text-sm font-extrabold text-[#111827]">
                      {c.titulo || c.descripcion?.substring(0, 50) || 'Sin título'}
                    </p>
                    <p className="mt-0.5 text-xs text-[#6b7280]">
                      Usuario: <span className="font-semibold">{c.nameUsuario}</span>
                    </p>
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
                          {selectedClaim.estado?.nombre || 'Sin estado'}
                        </span>
                        <span className="text-xs text-[#6b7280]">
                          Presentado el {new Date(selectedClaim.fechaHoraInicio).toLocaleDateString('es-AR')}
                        </span>
                      </div>

                      <h4 className="text-1xl md:text-3xl font-extrabold text-[#111827] tracking-tight">
                        Reclamo: {selectedClaim.titulo || selectedClaim.descripcion?.substring(0, 50)}
                      </h4>
                      <p className="text-sm text-[#4b5563] leading-relaxed max-w-3xl">
                        {selectedClaim.descripcion}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-5">
                    <p className="text-xs font-bold tracking-wider uppercase text-[#6b7280] mb-2">
                      Prioridad
                    </p>
                    <p className="text-lg font-extrabold text-[#111827]">
                      {selectedClaim.prioridad || 'No asignada'}
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-5">
                    <p className="text-xs font-bold tracking-wider uppercase text-[#6b7280] mb-2">
                      Usuario
                    </p>
                    <p className="text-lg font-extrabold text-[#111827]">
                      {selectedClaim.nameUsuario.toUpperCase()}
                    </p>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-5">
                    <p className="text-xs font-bold tracking-wider uppercase text-[#6b7280] mb-2">
                      Criticidad
                    </p>
                    <p className="text-lg font-extrabold text-[#111827]">
                      {selectedClaim.criticidad || 'No asignada'}
                    </p>
                  </div>
                </div>

                {/* Activity */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] p-6">
                  <h2 className="text-lg font-extrabold text-[#111827] mb-4">
                    Historial de cambios de estado
                  </h2>

                  <ol className="space-y-4">
                    {selectedClaim.cambioEstado?.map((cambio, idx) => (
                      <li key={cambio._id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <span className="mt-1 w-2.5 h-2.5 rounded-full bg-[var(--color-primary)]" />
                          {idx !== selectedClaim.cambioEstado.length - 1 && <span className="flex-1 w-[2px] bg-[#e5e7eb] mt-2" />}
                        </div>
                        <div className="flex-1 pb-1">
                          <div className="flex items-start justify-between gap-4">
                            <p className="text-sm font-extrabold text-[#111827]">{cambio.estado?.nombre || 'Estado desconocido'}</p>
                            <p className="text-xs text-[#9ca3af] whitespace-nowrap">
                              {new Date(cambio.fechaHoraCambio).toLocaleDateString('es-AR')}
                            </p>
                          </div>
                          <p className="mt-1 text-sm text-[#4b5563] leading-relaxed">
                            {cambio.estado?.descripcion || 'Sin descripción'}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
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
