/// <reference types="vite/client" />
import axios from "axios";


export async function RegisterAuth(email: string, password: string, fullName: string, roles: 'user') {

    try{
        const response = await axios.post(`${import.meta.env.VITE_BACK_AUTH_DEV}/auth/register`, { email, password, fullName, roles});
        console.log(response.data);

        if (response.data.token) {
            localStorage.setItem("token", response.data.token);
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
            return true;
        }
        return false;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
                alert("Direccion de mail o contraseña incorrecta!");
            }
            if (error.response?.status === 404) {
                alert("Servicio de backend no funcionando!")
            }
        }
        return false;
    }
}