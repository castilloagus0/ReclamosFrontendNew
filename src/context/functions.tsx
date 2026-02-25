export function statusPillClasses(status: any) {
    switch (status) {
      case 'Pendiente':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'En progreso':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Resuelto':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  }
  
export function priorityTextClasses(priority: any) {
    switch (priority) {
      case 'Alta':
        return 'text-rose-600';
      case 'Media':
        return 'text-amber-600';
      case 'Baja':
        return 'text-emerald-600';
      default:
        return 'text-gray-600';
    }
  }
  