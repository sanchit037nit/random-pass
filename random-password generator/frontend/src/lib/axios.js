import axios from "axios";

export const axiosinstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:5003/api" : "https://ranpass.onrender.com/api",
    withCredentials:true,
})



