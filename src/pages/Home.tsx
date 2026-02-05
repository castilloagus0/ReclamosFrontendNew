import React from 'react';

import '../App.css';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import FeatureCard from '../components/FeatureCard';

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] text-[var(--color-text)]">
      <Navbar />

      <main className="max-w-[1200px] mx-auto px-6">
        {/* Hero */}
        <section className="pt-12 pb-16 md:py-20">
          <div className="flex flex-col gap-10 items-center lg:flex-row lg:gap-16">
            <div className="flex flex-col gap-8 flex-1">
              <div className="flex flex-col gap-4">
                <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl text-[var(--color-text)]">
                  Resolución simplificada. Presenta y gestiona reclamos sin esfuerzo.
                </h1>
                <p className="text-lg text-[var(--color-text-muted)] leading-relaxed max-w-[600px]">
                  Una forma segura, transparente y rápida de manejar quejas formales. Obtén la resolución que mereces sin el dolor de cabeza del papeleo.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button text="Presentar un reclamo hoy" onClick={() => {}} color="primary" />
                <Button text="Saber más" onClick={() => {}} color="outline" />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {['#2196F3', '#f97316', '#22c55e'].map((color, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-white"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Con la confianza de <span className="font-bold text-[var(--color-primary)]">10.000+</span> usuarios en todo el mundo
                </p>
              </div>
            </div>
            <div className="w-full flex-1">
              <div className="aspect-video md:aspect-square bg-[#1e293b] rounded-2xl shadow-xl overflow-hidden flex items-center justify-center">
                <span className="text-gray-400 text-sm">Vista previa del panel</span>
              </div>
            </div>
          </div>
        </section>

        {/* Por qué elegir nuestra plataforma */}
        <section id="features" className="py-16">
          <div className="flex flex-col gap-4 text-center items-center mb-12">
            <p className="text-[var(--color-primary)] font-bold tracking-widest text-xs uppercase">
              El futuro de la presentación
            </p>
            <h2 className="text-[var(--color-text)] text-3xl font-bold leading-tight md:text-4xl max-w-[720px]">
              ¿Por qué elegir nuestra plataforma?
            </h2>
            <p className="text-[var(--color-text-muted)] text-base leading-normal max-w-[600px]">
              Hemos construido una infraestructura de clase mundial para manejar tus reclamos más sensibles con velocidad y precisión.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon="bolt"
              title="Eficiencia"
              description="Presenta reclamos en minutos con nuestro flujo de trabajo digital optimizado que elimina las entradas manuales repetitivas."
            />
            <FeatureCard
              icon="visibility"
              title="Transparencia"
              description="Sigue cada paso del estado de tu reclamo en tiempo real con notificaciones automáticas y un registro de auditoría completo."
            />
            <FeatureCard
              icon="verified_user"
              title="Seguridad"
              description="Tu información sensible está protegida con cifrado de nivel empresarial y estrictos protocolos de privacidad."
            />
          </div>
        </section>

        {/* Acerca de ClaimsApp */}
        <section className="py-16 text-center">
          <h2 className="text-[var(--color-text)] text-3xl font-bold mb-6">Acerca de ClaimsApp</h2>
          <p className="text-[var(--color-text-muted)] text-base leading-relaxed max-w-[720px] mx-auto mb-10">
            ClaimsApp se dedica a simplificar el complejo mundo de las quejas formales. Nuestra misión es proporcionar una plataforma transparente y accesible para que todos puedan buscar una resolución sin esfuerzo. Creemos que la tecnología debe empoderar a los usuarios para navegar los desafíos administrativos con confianza.
          </p>
          <div className="flex flex-wrap justify-center gap-8">
            <span className="font-bold text-[var(--color-text)]">EMPRESA DE CONFIANZA</span>
            <span className="font-bold text-[var(--color-text)]">SEGURIDAD GLOBAL</span>
            <span className="font-bold text-[var(--color-text)]">TECNOLOGÍA LEGAL</span>
          </div>
        </section>
      </main>

      {/* CTA - ancho completo */}
      <section className="w-full bg-[var(--color-primary)] rounded-t-3xl py-16 px-6 mt-4">
        <div className="max-w-[1200px] mx-auto text-center flex flex-col items-center gap-6">
          <h2 className="text-white text-3xl md:text-4xl font-bold leading-tight">
            ¿Listo para resolver tu reclamo?
          </h2>
          <p className="text-white/95 text-lg max-w-[600px]">
            Únete a miles de usuarios que han gestionado con éxito sus quejas con nuestra plataforma optimizada.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button text="Empezar ahora" onClick={() => {}} color="white" />
            <Button text="Contactar ventas" onClick={() => {}} color="outline-white" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
