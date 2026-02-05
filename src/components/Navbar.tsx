import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from './Button';

const LogoM = ({ className = 'w-6 h-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 20V4L12 14L18 4V20H15V12L12 16L9 12V20H6Z" fill="var(--color-primary)" />
  </svg>
);

type NavbarVariant = 'default' | 'auth';

export default function Navbar({ variant = 'default' }: { variant?: NavbarVariant }) {
  const navigate = useNavigate();
  const isAuth = variant === 'auth';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-solid border-[#e5e7eb] bg-white">
      <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <LogoM />
          <span className="text-xl font-bold text-[#1f2937] hover:opacity-80">
            {isAuth ? 'Claims Portal' : 'ClaimsApp'}
          </span>
        </Link>
        <nav className="flex items-center gap-6 md:gap-8">
          {isAuth ? (
            <>
              <Button text="Register" onClick={() => navigate('/register')} color="primary" />
            </>
          ) : (
            <>
              <div className="flex gap-3">
                <Button text="Iniciar sesión" onClick={() => navigate('/login')} color="outline" />
                <Button text="Registrarse" onClick={() => navigate('/register')} color="primary" />
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
