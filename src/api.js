import axios from "axios";
import authHeader from "./services/auth-header.js";

export const apiUrl = "http://127.0.0.1:8000/api/v1/";

const instance = axios.create({
    baseURL: apiUrl,
    headers: {
        "Content-Type": "application/json",
        ...authHeader()
    },
})

export const formsRequestInstance = axios.create({
    baseURL: apiUrl,
    headers: {
        "Content-Type": "multipart/form-data",
        ...authHeader()
    },
})

export default instance;