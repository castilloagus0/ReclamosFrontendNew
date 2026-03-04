import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from './Sidebar';

export type AdminView = 'dashboard' | 'reclamos' | 'graficos' | 'usuarios';

type MenuDashboardAdminProps = {
  activeView: AdminView;
  onViewChange: (view: AdminView) => void;
};

type MenuDashboardUserProps = {
  children: React.ReactNode;
};

type MenuDashboardProps =
  | ({ variant: 'admin' } & MenuDashboardAdminProps)
  | ({ variant: 'user' } & MenuDashboardUserProps);

function NavItem({
  icon,
  label,
  view,
  activeView,
  onViewChange,
}: {
  icon: string;
  label: string;
  view: AdminView;
  activeView: AdminView;
  onViewChange: (view: AdminView) => void;
}) {
  const isActive = activeView === view;
  return (
    <button
      type="button"
      onClick={() => onViewChange(view)}
      className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-left text-sm font-medium transition-colors ${
        isActive
          ? 'bg-[#9333ea] text-[var(--color-primary)]'
          : 'text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#111827]'
      }`}
    >
      <span className="material-symbols-outlined text-[22px]">{icon}</span>
      {label}
    </button>
  );
}

function MenuDashboardAdmin({ activeView, onViewChange }: MenuDashboardAdminProps) {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('roles');
    localStorage.removeItem('fullName');
    localStorage.removeItem('id');
    navigate('/');
  };

  return (
    <aside className="w-64 min-w-64 flex-shrink-0 bg-white border-r border-[#e5e7eb] flex flex-col">
      {/* Branding */}
      <div className="p-6 border-b border-[#e5e7eb]">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)] flex items-center justify-center text-white font-bold">
            9
          </div>
          <span className="text-lg font-bold text-[#111827]">Claims Admin</span>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <NavItem icon="dashboard" label="Dashboard" view="dashboard" activeView={activeView} onViewChange={onViewChange} />
        <NavItem icon="bar_chart" label="Analiticas" view="graficos" activeView={activeView} onViewChange={onViewChange} />
        <NavItem icon="group" label="Usuarios" view="usuarios" activeView={activeView} onViewChange={onViewChange} />
      </nav>

      {/* Footer sidebar: perfil con desplegable */}
      <div className="relative p-3 border-t border-[#e5e7eb]" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setDropdownOpen((o) => !o)}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-left hover:bg-[#f3f4f6] transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-[#e5e7eb] flex items-center justify-center text-xs font-semibold shrink-0">
            {typeof localStorage !== 'undefined'
              ? (localStorage.getItem('fullName') || 'AR')
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2)
              : 'AR'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#111827] truncate">
              {typeof localStorage !== 'undefined'
                ? localStorage.getItem('fullName') || 'Alex Rivera'
                : 'Alex Rivera'}
            </p>
            <p className="text-[11px] text-[#6b7280]">System Admin</p>
          </div>
          <span
            className={`material-symbols-outlined text-[20px] text-[#6b7280] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
          >
            expand_more
          </span>
        </button>

        {dropdownOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-1 bg-white rounded-xl shadow-lg border border-[#e5e7eb] py-1 z-50">
            <Link
              to="/"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#111827] transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">home</span>
              Ir al inicio
            </Link>
            <button
              type="button"
              onClick={() => {
                setDropdownOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

function MenuDashboardUser({ children }: MenuDashboardUserProps) {
  return (
    <Sidebar title="Tus reclamos" initialOpen={false}>
      {children}
    </Sidebar>
  );
}

export default function MenuDashboard(props: MenuDashboardProps) {
  if (props.variant === 'admin') {
    return (
      <MenuDashboardAdmin
        activeView={props.activeView}
        onViewChange={props.onViewChange}
      />
    );
  }
  return <MenuDashboardUser>{props.children}</MenuDashboardUser>;
}
