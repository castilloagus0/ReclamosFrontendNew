import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Footer from '../components/Footer'

//Iconos
import { EyeIcon, EyeOffIcon, GoogleIcon, SSOIcon } from '../components/Icons';

const inputClass =
  'w-full px-4 py-2.5 rounded-lg border border-[#d1d5db] text-[#1f2937] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrar con backend
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Navbar variant="auth" />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[420px] bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-8">
          <p className="text-4xl font-bold text-[--color-text] m-3 flex items-center justify-center">Iniciar Sesión</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#374151] mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@gmail.com"
                className={inputClass}
                autoComplete="email"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-[#374151]">
                  Contraseña
                </label>
                <Link to="#" className="text-sm text-(--color-primary) hover:underline">
                  Olvidaste la contraseña?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pr-12`}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#374151] p-1 bg-transparent! border-0 outline-none focus:ring-0 shadow-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <Button type="submit" text="Iniciar Sesión" color="primary" className="w-full" />
          </form>

          <div className="mt-6 flex items-center gap-4">
            <span className="flex-1 h-px bg-[#e5e7eb]" />
            <span className="text-xs font-medium text-[#9ca3af] uppercase tracking-wider">
              Or continue with
            </span>
            <span className="flex-1 h-px bg-[#e5e7eb]" />
          </div>

          <div className="mt-6 flex gap-3">
            <Button icon={<GoogleIcon />} text="Google" color="outline" className="flex-1" />
            <Button icon={<SSOIcon />} text="SSO" color="outline" className="flex-1" />
          </div>

          <p className="mt-6 text-center text-sm text-[#6b7280]">
            No tienes cuenta?{' '}
            <Link to="/register" className="text-(--color-primary) font-medium hover:underline">
              Crear cuenta
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
