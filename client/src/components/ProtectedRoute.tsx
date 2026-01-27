import { Outlet, Navigate } from "react-router";
import Loading from "../_global/Loading";
import { useAuthContext } from "../context/auth-context"

export default function ProtectedRoute(){
    const { isAuthenticated, isPending } = useAuthContext();

    if(isPending) return <Loading />

    if(!isAuthenticated) return <Navigate to="/login" replace />

    return <Outlet />
}