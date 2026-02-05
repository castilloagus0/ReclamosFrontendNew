import React from 'react';

const LogoM = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 20V4L12 14L18 4V20H15V12L12 16L9 12V20H6Z" fill="var(--color-primary)" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-[#e5e7eb]">
      <div className="max-w-[1200px] mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <LogoM />
              <span className="text-lg font-bold text-[var(--color-text)]">ClaimsApp</span>
            </div>
            <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
              Haciendo las resoluciones formales más rápidas y accesibles para todos, en todas partes.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-[var(--color-text)] text-sm uppercase tracking-wider">Producto</h4>
            <a className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)]" href="#">Características</a>
            <a className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)]" href="#">Seguridad</a>
            <a className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)]" href="#">Precios</a>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-[var(--color-text)] text-sm uppercase tracking-wider">Recursos</h4>
            <a className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)]" href="#">Centro de ayuda</a>
            <a className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)]" href="#">Guía</a>
            <a className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)]" href="#">API</a>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-[var(--color-text)] text-sm uppercase tracking-wider">Legal</h4>
            <a className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)]" href="#">Privacidad</a>
            <a className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)]" href="#">Términos</a>
            <a className="text-sm text-[var(--color-text-muted)] hover:text-[var(--color-primary)]" href="#">Cumplimiento</a>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-12 pt-8 border-t border-[#e5e7eb]">
          <p className="text-sm text-[var(--color-text-muted)]">
            © 2024 ClaimsApp Inc. Todos los derechos reservados.
          </p>
          <div className="flex gap-3">
            <a
              href="#"
              className="w-9 h-9 rounded-lg border border-[var(--color-border)] bg-white flex items-center justify-center text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
              aria-label="Idioma"
            >
              <span className="material-symbols-outlined text-lg">language</span>
            </a>
            <a
              href="#"
              className="w-9 h-9 rounded-lg border border-[var(--color-border)] bg-white flex items-center justify-center text-[var(--color-text-muted)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-colors"
              aria-label="Contacto"
            >
              <span className="material-symbols-outlined text-lg">mail</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
