import { Outlet, Navigate } from "react-router";
import Loading from "../_global/Loading";
import { useAuthContext } from "../context/auth-context";
import type { Role } from "../types/types";

export default function RoleProtectedRoute({
    allowedRoles,
}: { allowedRoles: Role[] }) {
    const { isAuthenticated, isPending, role } = useAuthContext();

    if (isPending) return <Loading />

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/403" replace />

    return <Outlet />;
}