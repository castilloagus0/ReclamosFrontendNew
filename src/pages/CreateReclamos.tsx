import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

//Services
import { CreateReclamo } from '../service/reclamo.service';
import { getProyectos } from '../service/proyecto.service';
import { proyectos } from '@/interfaces/proyectos.interface';
import { useEffect } from 'react';

export default function CreateReclamos() {
  const [categorias, setCategorias] = useState<proyectos[]>([]);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    proyectoId: '',
    tipoReclamoId: '',
    fechaIncidente: new Date().toISOString().split('T')[0]
  });
  const navigate = useNavigate();

  useEffect(() => {
    getProject();
  }, [])

  const getProject = async () => {
    try {
      const data: proyectos[] = await getProyectos();
      setCategorias(data);
    } catch (error) {
      console.error("Error al obtener proyectos:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const idUsuario = localStorage.getItem('id') || '';
      const nameUsuario = localStorage.getItem('fullName') || '';
      
      const result = await CreateReclamo(
        formData.titulo,
        formData.descripcion,
        '', // imagenReclamo - por ahora vacío
        formData.proyectoId,
        formData.tipoReclamoId,
        idUsuario,
        nameUsuario
      );

      console.log("result", result)
    } catch (error) {
      console.error('Error al crear reclamo:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-page)] text-[var(--color-text)]">
      <Navbar />

      <main className="flex-1 flex">
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
              <p className="text-sm md:text-base text-[var(--color-text-muted)] max-w-max">
                Completa el formulario con los detalles de tu reclamo.
              </p>
            </header>

            {/* Card */}
            <form onSubmit={handleSubmit}>
              <div className="bg-white rounded-2xl shadow-sm border border-[#e5e7eb] overflow-hidden">
                <div className="px-6 py-6 md:px-8 md:py-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-base md:text-lg font-semibold text-[var(--color-text)]">
                      Detalles del reclamo
                    </h3>
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
                        value={formData.proyectoId}
                        onChange={(e) => setFormData({...formData, proyectoId: e.target.value})}
                        required
                        className="mt-1 block w-full rounded-lg border border-[#d1d5db] bg-white px-3 py-2.5 text-sm text-[#111827] shadow-sm focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
                      >
                        <option value="" disabled>
                          Selecciona una categoría
                        </option>
                        {categorias.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.nombre}
                          </option>
                        ))}
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
                        value={formData.fechaIncidente}
                        onChange={(e) => setFormData({...formData, fechaIncidente: e.target.value})}
                        id="incidentDate"
                        type="date"
                        required
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
                        value={formData.titulo}
                        onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                        required
                        placeholder="Ej. Corte de luz"
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
                        value={formData.descripcion}
                        onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                        required
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
                  <div className="mt-8 pt-6 border-t border-[#e5e7eb] flex justify-end">
                    <div className="flex flex-wrap gap-3">
                      <Button
                        text="Cancelar"
                        color="outline"
                        type="button"
                        onClick={() => navigate('/user-dashboard')}
                      />
                      <Button
                        text="Enviar reclamo"
                        color="primary"
                        type="submit"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
