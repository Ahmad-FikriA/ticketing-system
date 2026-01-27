import axios from "axios";
import { api } from "../lib/axios/api"
import type {
    ILogin,
    LoginResponse,
    ICreateUser,
    IUser
} from "../types/types"


export const loginUser = async (data: ILogin): Promise<LoginResponse> => {
    try {
        const res = await api.post("/auth/login", data);
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Axios error:", {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
            });
        } else {
            console.error("Unknown error:", error);
        }
        throw error;
    }
}

export const logoutUser = async (): Promise<void> => {
    try {
        await api.post("/auth/logout");
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Logout Failed:", {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
            });
        } else {
            console.error("Unknown logout error:", error);
        }
        throw error;
    }
}

export const createUser = async (data: ICreateUser): Promise<LoginResponse> => {
    try {
        const res = await api.post("/auth/register", data);
        return res.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Axios error:", {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
            });
        } else {
            console.error("Unknown error:", error);
        }
        throw error;
    }
}

export const getUser = async (): Promise<IUser> => {
    try {
        const res = await api.get("/auth/me");
        return res.data.data; // Extract user from { success, data: user }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Axios error:", {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
            });
        } else {
            console.error("Unknown error:", error);
        }
        throw error;
    }
}
