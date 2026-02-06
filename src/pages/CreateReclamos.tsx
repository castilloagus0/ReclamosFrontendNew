import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import Sidebar from '../components/Sidebar';

const steps = [
  { id: 1, title: 'Detalles del reclamo', subtitle: 'Información básica' },
  { id: 2, title: 'Carga de evidencia', subtitle: 'Sube tus archivos' },
  { id: 3, title: 'Confirmación', subtitle: 'Revisar y enviar' },
];

export default function CreateReclamos() {
  const [activeStep, setActiveStep] = useState(1);

  const handleNextStep = () => {
    setActiveStep((prev) => (prev < steps.length ? prev + 1 : prev));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-page)] text-[var(--color-text)]">
      <Navbar />

      <main className="flex-1 flex">
        { /*<Sidebar
          steps={steps}
          activeStepId={activeStep}
          onStepChange={setActiveStep}
          userType="user"
          title="Flujo de reclamo"
        />*/}

        {/* Content */}
        <section className="flex-1 flex justify-center bg-[#f3f4f6] px-4 py-6 md:px-8 lg:px-12">
          <div className="w-full max-w-[960px]">
            {/* Page header */}
            <header className="mb-6 md:mb-8">
              <p className="text-xs font-semibold tracking-[0.16em] text-[var(--color-primary)] uppercase mb-2">
                Nuevo reclamo
              </p>
              <p className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-2">
                Presentar un nuevo reclamo
              </p>
              <p className="text-sm md:text-base text-[var(--color-text-muted)] max-w-2xl">
                Nuestro proceso guiado te ayuda a completar tu reclamo con precisión y seguridad,
                paso a paso.
              </p>
            </header>

            {/* Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] overflow-hidden">
              {/* Steps header */}
              <div className="px-6 pt-5 pb-4 border-b border-[#e5e7eb] bg-[#f9fafb]">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.2em] text-[var(--color-primary)] uppercase mb-1">
                      Paso {activeStep} de {steps.length}
                    </p>
                    <h2 className="text-lg font-semibold text-[var(--color-text)]">
                      {steps.find((s) => s.id === activeStep)?.title}
                    </h2>
                  </div>
                  <p className="text-xs text-[#9ca3af] md:text-right">
                    Borrador guardado hace 2 minutos
                  </p>
                </div>

                {/* Horizontal stepper */}
                <div className="mt-6">
                  {/* Línea de progreso de fondo */}
                  <div className="relative h-10 flex items-center">
                    <div className="absolute left-6 right-6 top-1/2 h-[2px] -translate-y-1/2 bg-[#e5e7eb]" />

                    <div className="relative flex w-full justify-between px-6">
                      {steps.map((step, index) => {
                        const isActive = activeStep === step.id;
                        const isCompleted = activeStep > step.id;

                        const baseCircle =
                          'flex items-center justify-center rounded-full border shadow-sm';

                        const stateCircle = isActive
                          ? 'bg-[var(--color-primary)] border-[var(--color-primary)] text-white'
                          : isCompleted
                          ? 'bg-white border-[var(--color-primary)] text-[var(--color-primary)]'
                          : 'bg-white border-[#e5e7eb] text-[#9ca3af]';

                        const icon =
                          index === 0 ? '📄' : index === 1 ? '📤' : '✅';

                        return (
                          <div key={step.id} className="flex flex-col items-center flex-1">
                            <div
                              className={`${baseCircle} ${stateCircle} w-9 h-9 text-base`}
                            >
                              <span aria-hidden>{icon}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Etiquetas de pasos */}
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    {steps.map((step) => {
                      const isActive = activeStep === step.id;
                      const isCompleted = activeStep > step.id;

                      const statusLabel = isActive
                        ? 'Activo'
                        : isCompleted
                        ? 'Completado'
                        : 'Pendiente';

                      const statusClass = isActive
                        ? 'text-[var(--color-primary)]'
                        : isCompleted
                        ? 'text-[#16a34a]'
                        : 'text-[#9ca3af]';

                      return (
                        <div key={step.id} className="flex flex-col items-center">
                          <p className="text-xs font-semibold text-[#111827]">
                            {step.title}
                          </p>
                          <p className={`text-[11px] font-medium ${statusClass}`}>
                            {statusLabel}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Step content - for ahora solo maquetamos el primer paso */}
              <div className="px-6 py-6 md:px-8 md:py-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-base md:text-lg font-semibold text-[var(--color-text)]">
                    Detalles del reclamo
                  </h3>
                  <span className="inline-flex items-center rounded-full border border-[#e5e7eb] bg-[#f9fafb] px-3 py-1 text-[11px] font-medium text-[#6b7280]">
                    Borrador
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                  <div>
                    <label
                      htmlFor="claimCategory"
                      className="block text-sm font-medium text-[#374151] mb-1.5"
                    >
                      Categoría del reclamo
                    </label>
                    <select
                      id="claimCategory"
                      className="mt-1 block w-full rounded-lg border border-[#d1d5db] bg-white px-3 py-2.5 text-sm text-[#111827] shadow-sm focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Selecciona una categoría
                      </option>
                      <option value="producto">Defecto de producto</option>
                      <option value="servicio">Problema con el servicio</option>
                      <option value="facturacion">Facturación</option>
                      <option value="otro">Otro</option>
                    </select>
                    <p className="mt-1.5 text-xs text-[#9ca3af]">
                      Elige la categoría que mejor describa el problema.
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="incidentDate"
                      className="block text-sm font-medium text-[#374151] mb-1.5"
                    >
                      Fecha del incidente
                    </label>
                    <input
                      id="incidentDate"
                      type="date"
                      className="mt-1 block w-full rounded-lg border border-[#d1d5db] bg-white px-3 py-2.5 text-sm text-[#111827] shadow-sm focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                    />
                    <p className="mt-1.5 text-xs text-[#9ca3af]">
                      Indica cuándo ocurrió el incidente.
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="claimTitle"
                      className="block text-sm font-medium text-[#374151] mb-1.5"
                    >
                      Título del reclamo
                    </label>
                    <input
                      id="claimTitle"
                      type="text"
                      placeholder="Ej. Pantalla rota al recibir el producto"
                      className="mt-1 block w-full rounded-lg border border-[#d1d5db] bg-white px-3 py-2.5 text-sm text-[#111827] placeholder:text-[#9ca3af] shadow-sm focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="claimDescription"
                      className="block text-sm font-medium text-[#374151] mb-1.5"
                    >
                      Descripción detallada
                    </label>
                    <textarea
                      id="claimDescription"
                      rows={5}
                      placeholder="Por favor, proporciona todos los detalles relevantes del incidente, incluyendo fechas, personas involucradas y cualquier comunicación previa."
                      className="mt-1 block w-full rounded-lg border border-[#d1d5db] bg-white px-3 py-2.5 text-sm text-[#111827] placeholder:text-[#9ca3af] shadow-sm focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none resize-none"
                    />
                    <div className="mt-1.5 flex items-center justify-between text-xs text-[#9ca3af]">
                      <span>Mínimo recomendado: 100 caracteres.</span>
                      <span>0 / 2000</span>
                    </div>
                  </div>
                </div>

                {/* Upload section */}
                <div className="mt-8 rounded-xl border border-dashed border-[#d1d5db] bg-[#f9fafb] px-5 py-6">
                  <h4 className="text-sm font-semibold text-[#111827] mb-1.5">
                    Subir evidencia de respaldo
                  </h4>
                  <p className="text-xs text-[#6b7280] mb-4">
                    Arrastra y suelta fotos, PDFs o recibos que respalden tu reclamo. Tamaño máximo 10&nbsp;MB por archivo.
                  </p>
                  <div className="flex flex-col items-center justify-center gap-3 text-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white border border-[#e5e7eb]">
                      <span className="text-2xl text-[var(--color-primary)]">⬆</span>
                    </div>
                    <div className="text-xs text-[#6b7280] space-y-1">
                      <p>
                        Arrastra archivos aquí o{' '}
                        <span className="text-[var(--color-primary)] font-medium cursor-pointer">
                          explora en tu dispositivo
                        </span>
                      </p>
                      <p className="text-[11px] text-[#9ca3af]">
                        Se admiten imágenes (JPG, PNG), PDF y documentos escaneados.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer actions */}
                <div className="mt-8 pt-6 border-t border-[#e5e7eb] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <Button
                    text="Cancelar"
                    color="outline"
                    onClick={() => {
                      // TODO: manejar cancelación o navegación
                    }}
                  />

                  <div className="flex flex-wrap gap-3 justify-end">
                    <Button
                      text="Guardar como borrador"
                      color="white"
                      onClick={() => {
                        // TODO: manejar guardado de borrador
                      }}
                    />
                    <Button
                      text="Siguiente paso"
                      color="primary"
                      onClick={handleNextStep}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
