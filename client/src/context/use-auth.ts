import { useGetUser } from "../lib/queries/queries";

export const useAuth = () => {
    const { data, isPending, isError } = useGetUser();
    return {
        id: data?.id ?? "",
        email: data?.email ?? "",
        name: data?.name ?? "",
        role: data?.role ?? null,
        isAuthenticated: !!data && !isError,
        isPending,

    };
};