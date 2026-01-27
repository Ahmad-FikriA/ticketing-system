import axios from "axios";
import { api } from "../lib/axios/api";
import type { ITicketType } from "../types/types";

// Get all ticket types (public)
export const getAllTicketTypes = async (): Promise<ITicketType[]> => {
    try {
        const res = await api.get("/ticket-types");
        return res.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Failed to fetch ticket types:", {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
            });
        }
        throw error;
    }
};

// Get ticket type by ID (public)
export const getTicketTypeById = async (id: string): Promise<ITicketType> => {
    try {
        const res = await api.get(`/ticket-types/${id}`);
        return res.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Failed to fetch ticket type:", {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
            });
        }
        throw error;
    }
};
