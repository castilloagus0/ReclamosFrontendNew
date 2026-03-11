import axios from "axios"

export async function getAgentes(){
    try{
        const response = await axios.get(`${import.meta.env.VITE_BACK_RECLAMOS_DEV}/agente`)
        return response.data
    }catch(err){
        throw err;
    }
}