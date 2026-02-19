import axios from "axios";

export async function CreateReclamo(titulo: string, descripcion: string, imagenReclamo: string, proyectoId: string, tipoReclamoId: string, idUsuario: string, nameUsuario: string){
    try{
        const payload = {
            titulo,
            descripcion,
            imagenReclamo,
            proyectoId,
            tipoReclamoId,
            idUsuario,
            nameUsuario
        };
        
        console.log('Enviando reclamo:', payload);
        console.log('URL:', `${import.meta.env.VITE_BACK_RECLAMOS_DEV}/reclamo/crear`);
        
        const createReclamo =  await axios.post(`${import.meta.env.VITE_BACK_RECLAMOS_DEV}/reclamo/crear`, payload);
        
        console.log("reclamo creado", createReclamo.data);
        return createReclamo.data;

    }catch(err){
        console.error('Error completo:', err);
        if (axios.isAxiosError(err)) {
            console.error('Response data:', err.response?.data);
            console.error('Response status:', err.response?.status);
        }
        return false;
    }
}

export async function GetReclamos(){}

