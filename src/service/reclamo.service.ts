import axios from "axios";


export async function getReclamos(page: number = 1, limit: number = 10,): Promise<any> {
    try {
        const params: any = { page, limit };
        const response = await axios.get(`${import.meta.env.VITE_BACK_RECLAMOS_DEV}/reclamo`, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching reclamos:', error);
        throw error;
    }
}

export async function CreateReclamo(titulo: string, descripcion: string, imagenReclamo: string, proyectoId: string, tipoReclamoId: string, idUsuario: string, nameUsuario: string, emailUsuario: string) {
    try {
        const payload = {
            titulo,
            descripcion,
            imagenReclamo,
            proyectoId,
            tipoReclamoId,
            idUsuario,
            nameUsuario,
            emailUsuario
        };

        const createReclamo = await axios.post(`${import.meta.env.VITE_BACK_RECLAMOS_DEV}/reclamo/crear`, payload);

        return createReclamo.data;

    } catch (err) {
        console.error('Error completo:', err);
        if (axios.isAxiosError(err)) {
            console.error('Response data:', err.response?.data);
            console.error('Response status:', err.response?.status);
        }
        return false;
    }
}

export async function getReclamosByUser(idUsuario: string) {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACK_RECLAMOS_DEV}/reclamo/usuario/${idUsuario}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching reclamos:', error);
        throw error;
    }
}


export async function updateStatusCharts(id: string, nuevoEstadoID: string, agenteId: string) {
    try{
        const response = await axios.put(`${import.meta.env.VITE_BACK_RECLAMOS_DEV}/reclamo/cambiar-estado/${id}`, {
            estadoId: nuevoEstadoID,
            agenteId: agenteId
        })

        return response

    }catch(error){
        console.error('Error al cambiar de estado', error);
        throw error;
    }
}
