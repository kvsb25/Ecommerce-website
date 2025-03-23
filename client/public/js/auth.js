import axios from "axios";

const backendInstance = axios.create({
    baseURL: 'http://localhost:3000/'
});

backendInstance.interceptors.response.use((response)=> response, (error)=>{
    if(error.response) return true
})