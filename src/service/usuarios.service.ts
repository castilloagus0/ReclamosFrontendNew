import axios from "axios";

export async function getUsuarios() {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACK_AUTH_DEV}/auth`);
        return response.data;
    } catch (error) {
        console.error('Error fetching usuarios:', error);
        throw error;
    }
}