import React from "react";

export default function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="flex flex-col gap-6 rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
      <div className="w-14 h-14 rounded-full bg-[#E3F2FD] flex items-center justify-center text-[var(--color-primary)]">
        <span className="material-symbols-outlined text-3xl">{icon}</span>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-[var(--color-text)] text-xl font-bold leading-tight">{title}</h3>
        <p className="text-[var(--color-text-muted)] text-base font-normal leading-relaxed">{description}</p>
      </div>
    </div>
  );
} 