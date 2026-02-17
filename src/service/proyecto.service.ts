import axios from "axios";
 
export async function getProyectos(){
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACK_RECLAMOS_DEV}/proyecto`);
        return response.data;
    } catch (error) {
        console.error('Error fetching proyectos:', error);
        throw error;
    }
}