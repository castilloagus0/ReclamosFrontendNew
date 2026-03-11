import React from 'react';
import { ClipboardCheck, Headset, Gavel, Banknote, CheckCircle, Circle } from 'lucide-react';
import { ReclamoI } from '../interfaces/reclamo.interface';

export type TrazabilityStep = {
  label: string;
  fecha: string;
  isLast?: boolean;
};

function getStepIcon(label: string) {
  const l = label.toLowerCase();
  if (l.includes('iniciad')) return ClipboardCheck;
  if (l.includes('soporte') || l.includes('support') || l.includes('proceso')) return Headset;
  if (l.includes('legal') || l.includes('revisión')) return Gavel;
  if (l.includes('finanz') || l.includes('finance')) return Banknote;
  if (l.includes('resuelta') || l.includes('resolved')) return CheckCircle;
  return Circle;
}

/** Construye los pasos de trazabilidad a partir de un reclamo */
export function getStepsFromReclamo(reclamo: ReclamoI | null): TrazabilityStep[] {
  if (!reclamo) return [];

  const result: TrazabilityStep[] = [];
  result.push({ label: 'Iniciada', fecha: reclamo.fechaHoraInicio });

  const cambios = reclamo.cambioEstado ?? [];
  const ordenados = [...cambios].sort(
    (a, b) => new Date(a.fechaHoraCambio).getTime() - new Date(b.fechaHoraCambio).getTime()
  );
  ordenados.forEach((c) => {
    result.push({
      label: c.estado?.nombre ?? 'Cambio de estado',
      fecha: c.fechaHoraCambio,
    });
  });
  if (result.length > 0) result[result.length - 1].isLast = true;
  return result;
}

interface TrazabilityTimelineProps {
  steps: TrazabilityStep[];
  /** Si se muestra el título "Historial de estados" */
  showTitle?: boolean;
}

/** Timeline de trazabilidad compartido - misma UI en modal y en dashboard */
export default function TrazabilityTimeline({ steps, showTitle = true }: TrazabilityTimelineProps) {
  if (steps.length === 0) {
    return (
      <p className="text-sm text-[#6b7280] py-4">
        No hay historial de estados disponible.
      </p>
    );
  }

  return (
    <div className="pt-2">
      {showTitle && (
        <p className="text-xs font-bold uppercase tracking-wider text-[#6b7280] mb-4">
          Historial de estados
        </p>
      )}
      <div className="relative overflow-x-auto pb-4 px-2">
        <div className="flex items-start min-w-min">
          {steps.map((step, index) => {
            const isActive = step.isLast ?? index === steps.length - 1;
            const isCompleted = !isActive;
            const IconComponent = getStepIcon(step.label);
            const connectorColor = isCompleted ? 'bg-blue-500' : 'bg-gray-200';
            const prevStepCompleted = index === 0 || index - 1 < steps.length - 1;

            return (
              <div
                key={`${step.fecha}-${step.label}-${index}`}
                className="flex items-center flex-shrink-0"
              >
                {index > 0 && (
                  <div
                    className={`h-0.5 flex-shrink-0 ${prevStepCompleted ? 'bg-blue-500' : 'bg-gray-200'}`}
                    style={{ minWidth: '20px', width: '28px' }}
                    aria-hidden
                  />
                )}

                <div className="flex flex-col items-center flex-shrink-0 min-w-[90px]">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                      isCompleted || isActive
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-500 border-2 border-gray-300'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <p
                    className={`mt-2 text-xs font-bold text-center ${
                      isActive ? 'text-blue-500' : 'text-[#111827]'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="mt-0.5 text-[11px] text-[#6b7280] text-center">
                    {isActive
                      ? 'En progreso'
                      : new Date(step.fecha).toLocaleDateString('es-AR', {
                          day: '2-digit',
                          month: 'short',
                        })}
                  </p>
                </div>

                {!step.isLast && (
                  <div
                    className={`h-0.5 flex-shrink-0 ${connectorColor}`}
                    style={{ minWidth: '20px', width: '28px' }}
                    aria-hidden
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
