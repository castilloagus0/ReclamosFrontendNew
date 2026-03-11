import axios from "axios"

export async function getEstados(){
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACK_RECLAMOS_DEV}/estado`)
        return response.data
    }catch(err){
        throw err;
    }
}