import axios from "axios";
import { api } from "../lib/axios/api";
import type { ITicket } from "../types/types";

// Get all tickets (admin only)
export const getAllTickets = async (): Promise<ITicket[]> => {
    try {
        const res = await api.get("/tickets");
        return res.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Failed to fetch tickets:", {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
            });
        }
        throw error;
    }
};

// Get ticket by ID (admin only)
export const getTicketById = async (id: string): Promise<ITicket> => {
    try {
        const res = await api.get(`/tickets/${id}`);
        return res.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Failed to fetch ticket:", {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
            });
        }
        throw error;
    }
};

// Get ticket by code (for verification)
export const getTicketByCode = async (code: string): Promise<ITicket> => {
    try {
        const res = await api.get(`/tickets/code/${code}`);
        return res.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Failed to fetch ticket by code:", {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
            });
        }
        throw error;
    }
};

// Check in a ticket (admin only)
export const checkInTicket = async (id: string): Promise<ITicket> => {
    try {
        const res = await api.post(`/tickets/${id}/checkin`);
        return res.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Failed to check in ticket:", {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
            });
        }
        throw error;
    }
};

// Get tickets by user ID (admin only)
export const getTicketsByUser = async (userId: string): Promise<ITicket[]> => {
    try {
        const res = await api.get(`/tickets/user/${userId}`);
        return res.data.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Failed to fetch user tickets:", {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
            });
        }
        throw error;
    }
};
