import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { ICreateUser, ILogin } from "../../types/types";
import { createUser, loginUser, logoutUser } from "../../api/AuthApi";
import { checkInTicket } from "../../api/TicketApi";

export const useLogin = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ILogin) => loginUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["auth", "me"],
            });
        },
    });
};

export const useLogout = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => logoutUser(),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["auth", "me"],
            });
        },
    });
};

export const useCreateUser = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: ICreateUser) => createUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["auth", "me"],
            });
        },
    });
};

// Ticket Mutations
export const useCheckInTicket = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => checkInTicket(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["tickets"],
            });
        },
    });
};