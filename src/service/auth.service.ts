/// <reference types="vite/client" />
import axios from "axios";
import { toast } from "sonner";

export async function RegisterAuth(email: string, password: string, fullName: string, roles: string) {

    try{
        const response = await axios.post(`${import.meta.env.VITE_BACK_AUTH_DEV}/auth/register`, { email, password, fullName, roles});
        console.log(response.data);

        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("email", response.data.email);
            localStorage.setItem("roles", response.data.roles );
            localStorage.setItem("fullName", response.data.fullName);   
            localStorage.setItem("id", response.data._id);
            return true;
        }

        //Aca guardar el rol tambien
        return false;    
    }catch(err){
        console.error('Error en el registro:', err);
        return false;
    }
    
}


export async function LoginAuth(email: string, password: string) {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACK_AUTH_DEV}/auth/login`, { email, password });
        console.log(response.data);

        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("email", response.data.email);
            localStorage.setItem("roles", response.data.roles );
            localStorage.setItem("fullName", response.data.fullName);   
            localStorage.setItem("id", response.data._id);
            return true;
        }
        return false;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                toast.error("Dirección de mail o contraseña incorrecta");
            }
            if (error.response?.status === 404) {
                toast.error("Servicio de backend no disponible");
            }
        }
        return false;
    }
}