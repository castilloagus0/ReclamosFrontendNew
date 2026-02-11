import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Footer from '../components/Footer';

import {
  EyeIcon,
  EyeOffIcon,
  GoogleIcon,
  AppleIcon,
  ArrowRightIcon,
  PersonIcon,
  EnvelopeIcon,
  LockIcon,
  PhoneIcon,
} from '../components/Icons';

import { toast } from 'sonner';
import { RegisterAuth } from '../service/auth.service';
import { useLoading } from '../context/LoadingContext';

const inputClass =
  'w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#d1d5db] text-[#1f2937] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent';

const inputWrapperClass = 'relative';

const iconLeftClass =
  'absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] pointer-events-none';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { setLoading } = useLoading();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const registerUser = await RegisterAuth(email, password, fullName, 'user');

      if (registerUser) {
        toast.success('Usuario registrado con éxito');
        window.location.href = '/user-dashboard';
      } else {
        toast.error('Error al registrar usuario');
      }
    } catch (err) {

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Navbar variant="auth" />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[420px] bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-8">
          <p className="text-3xl font-bold text-(--color-text) text-center">
            Crea tu cuenta
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-[#374151] mb-1.5"
              >
                Nombre completo
              </label>
              <div className={inputWrapperClass}>
                <span className={iconLeftClass} aria-hidden>
                  <PersonIcon />
                </span>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="ej. Juan Pérez"
                  className={inputClass}
                  autoComplete="name"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#374151] mb-1.5"
              >
                Correo electrónico
              </label>
              <div className={inputWrapperClass}>
                <span className={iconLeftClass} aria-hidden>
                  <EnvelopeIcon />
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nombre@empresa.com"
                  className={inputClass}
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#374151] mb-1.5"
              >
                Contraseña
              </label>
              <div className={inputWrapperClass}>
                <span className={iconLeftClass} aria-hidden>
                  <LockIcon />
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`${inputClass} pr-12`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#374151] p-1 bg-transparent! border-0 outline-none focus:ring-0 shadow-none"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-[#374151] mb-1.5"
              >
                Número de teléfono
              </label>
              <div className={inputWrapperClass}>
                <span className={iconLeftClass} aria-hidden>
                  <PhoneIcon />
                </span>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+54 (11) 1234-5678"
                  className={inputClass}
                  autoComplete="tel"
                />
              </div>
            </div>

            <Button
              type="submit"
              text="Comenzar"
              color="primary"
              className="w-full justify-center flex-row-reverse"
              icon={<ArrowRightIcon />}
            />
          </form>

          <div className="mt-6 flex items-center gap-4">
            <span className="flex-1 h-px bg-[#e5e7eb]" />
            <span className="text-xs font-medium text-[#9ca3af] uppercase tracking-wider">
              O regístrate con
            </span>
            <span className="flex-1 h-px bg-[#e5e7eb]" />
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              icon={<GoogleIcon />}
              text="Google"
              color="outline"
              className="flex-1"
            />
            <Button
              icon={<AppleIcon />}
              text="Apple"
              color="outline"
              className="flex-1"
            />
          </div>

          <p className="mt-6 text-center text-sm text-[#6b7280]">
            ¿Ya tienes una cuenta?{' '}
            <Link
              to="/login"
              className="text-(--color-primary) font-medium hover:underline"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
