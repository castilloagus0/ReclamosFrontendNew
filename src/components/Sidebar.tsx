import React, { useMemo, useState } from 'react';

type UserType = 'user' | 'admin' | 'guest';

type SidebarStep = {
  id: number;
  title: string;
  subtitle?: string;    
};

type Props = {
  steps?: SidebarStep[];
  activeStepId?: number;
  onStepChange?: (id: number) => void;
  userType?: UserType;
  title?: string;
  initialOpen?: boolean;
  children?: React.ReactNode;
  className?: string;
};

export default function Sidebar({
  steps,
  activeStepId,
  onStepChange,
  userType = 'user',
  title,
  initialOpen = true,
  children,
  className = '',
}: Props) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(initialOpen);

  const headerTitle =
    title ?? (userType === 'admin' ? 'Panel administrador' : 'Flujo de reclamo');

  const normalizedSteps = useMemo(() => steps ?? [], [steps]);

  return (
    <aside
      className={`relative border-r border-[#e5e7eb] bg-white transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'w-100' : 'w-16'
      } ${className}`}
    >
      <div className="flex items-center justify-between px-3 py-4 border-b border-[#e5e7eb]">
        <button
          type="button"
          onClick={() => setIsSidebarOpen((open) => !open)}
          className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-[#e5e7eb] bg-white text-[#4b5563] hover:bg-[#f3f4f6] hover:border-[#d1d5db] transition-colors"
          aria-label={isSidebarOpen ? 'Colapsar menú' : 'Expandir menú'}
        >
          <span className="flex flex-col gap-1.5">
            <span className="w-4 h-[2px] rounded-full bg-[#4b5563]" />
            <span className="w-4 h-[2px] rounded-full bg-[#4b5563]" />
            <span className="w-4 h-[2px] rounded-full bg-[#4b5563]" />
          </span>
        </button>

        {isSidebarOpen && (
          <span className="text-xs font-medium text-[#6b7280] uppercase tracking-wide">
            {headerTitle}
          </span>
        )}
      </div>

      {isSidebarOpen && (
        <nav className="p-4 space-y-3 overflow-y-auto">
          {children}

          {normalizedSteps.length > 0 && (
            <div className="space-y-2">
              {normalizedSteps.map((step, index) => {
                const isActive = activeStepId === step.id;
                const isCompleted =
                  typeof activeStepId === 'number' ? activeStepId > step.id : false;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => onStepChange?.(step.id)}
                    disabled={!onStepChange}
                    className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors bg-transparent ${
                      isActive
                        ? 'bg-[var(--color-primary)]/5 text-[var(--color-primary)]'
                        : 'hover:bg-[#f3f4f6] text-[#4b5563]'
                    } ${!onStepChange ? 'opacity-70 cursor-default' : ''}`}
                  >
                    <div
                      className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold ${
                        isActive
                          ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                          : isCompleted
                          ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/40'
                          : 'border-[#d1d5db] text-[#6b7280] bg-white'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">{step.title}</span>
                      {step.subtitle && (
                        <span className="text-xs text-[#9ca3af]">{step.subtitle}</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </nav>
      )}
    </aside>
  );
}