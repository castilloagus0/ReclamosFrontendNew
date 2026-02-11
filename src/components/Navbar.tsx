import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from './Button';
import { Bell, Plus, User, Settings, LogOut, ChevronDown } from 'lucide-react';

const LogoM = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 20V4L12 14L18 4V20H15V12L12 16L9 12V20H6Z" fill="var(--color-primary)" />
  </svg>
);

type NavbarVariant = 'default' | 'auth';

export default function Navbar({ variant = 'default' }: { variant?: NavbarVariant }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuth, setIsAuth] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuth(!!token);
  }, [location.pathname]); // re-evalúa al cambiar de ruta (p.ej. tras login)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fullName = localStorage.getItem('fullName') || 'Usuario';
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('roles');
    localStorage.removeItem('fullName');
    localStorage.removeItem('id');
    setIsAuth(false);
    setDropdownOpen(false);
    navigate('/');
  };

  const navLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `text-sm font-medium transition-colors hover:text-[var(--color-primary)] ${
      isActive ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)] pb-0.5' : 'text-[var(--color-text)]'
    }`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-solid border-[#e5e7eb] bg-white">
      <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
        {/* Izquierda: logo + navegación (Inicio, Mis Reclamos, Nuevo Reclamo) */}
        <div className="flex items-center gap-6 md:gap-8">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <LogoM />
            <span className="text-xl font-bold text-[#1f2937] hover:opacity-80">
              ClaimFlow
            </span>
          </Link>

          {isAuth && (
            <nav className="flex items-center gap-6">
              <Link to="/" className={navLinkClass('/')}>
                Inicio
              </Link>
              <Link to="/user-dashboard" className={navLinkClass('/user-dashboard')}>
                Mis Reclamos
              </Link>
              <Button
                text="Nuevo Reclamo"
                onClick={() => navigate('/create-reclamo')}
                color="primary"
                icon={<Plus className="w-5 h-5" />}
              />
            </nav>
          )}
        </div>

        {/* Derecha: notificaciones (mock) + usuario */}
        <nav className="flex items-center gap-4">
          {isAuth ? (
            <>
              {/* Mock: conectar con backend cuando esté listo el endpoint de notificaciones */}
              <button
                type="button"
                className="relative p-2 rounded-full hover:bg-[#f3f4f6] text-[var(--color-text)]"
                aria-label="Notificaciones"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((o) => !o)}
                  className="flex items-center gap-3 p-1 pr-2 rounded-lg hover:bg-[#f3f4f6] transition-colors"
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-[var(--color-text)] leading-tight">
                      {fullName}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">Usuario verificado</p>
                  </div>
                  <div className="w-9 h-9 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-sm font-semibold shrink-0">
                    {initials}
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-[var(--color-text-muted)] transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-[#e5e7eb] py-2 z-50">
                    <p className="px-4 py-2 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
                      Configuración de cuenta
                    </p>
                    <Link
                      to="/user-dashboard"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-text)] hover:bg-[#f3f4f6]"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <User className="w-4 h-4 text-[var(--color-text-muted)]" />
                      Editar perfil
                    </Link>
                    <button
                      type="button"
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-[var(--color-text)] hover:bg-[#f3f4f6]"
                      onClick={() => {
                        setDropdownOpen(false);
                        // TODO: navegar a preferencias cuando exista la ruta
                      }}
                    >
                      <Settings className="w-4 h-4 text-[var(--color-text-muted)]" />
                      Preferencias
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Button text="Iniciar sesión" onClick={() => navigate('/login')} color="outline" />
              <Button text="Registrarse" onClick={() => navigate('/register')} color="primary" />
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
