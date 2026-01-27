import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../api/AuthApi";
import { getAllTickets, getTicketById, getTicketByCode } from "../../api/TicketApi";
import { getAllTicketTypes } from "../../api/TicketTypeApi";

export const useGetUser = () => {
    return useQuery({
        queryKey: ["auth", "me"],
        queryFn: async () => await getUser(),
        retry: false,
        staleTime: 0
    });
};

// Ticket Queries
export const useGetAllTickets = () => {
    return useQuery({
        queryKey: ["tickets"],
        queryFn: getAllTickets,
    });
};

export const useGetTicketById = (id: string) => {
    return useQuery({
        queryKey: ["tickets", id],
        queryFn: () => getTicketById(id),
        enabled: !!id,
    });
};

export const useGetTicketByCode = (code: string) => {
    return useQuery({
        queryKey: ["tickets", "code", code],
        queryFn: () => getTicketByCode(code),
        enabled: !!code,
    });
};

// Ticket Type Queries
export const useGetAllTicketTypes = () => {
    return useQuery({
        queryKey: ["ticket-types"],
        queryFn: getAllTicketTypes,
    });
};