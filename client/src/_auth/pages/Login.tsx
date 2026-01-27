import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { useLogin } from "../../lib/mutations/mutations";
import { useAuthContext } from "../../context/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Ticket, Mail, Lock } from "lucide-react";

const Login = () => {
    const navigate = useNavigate();
    const { isAuthenticated, role } = useAuthContext();
    const { mutateAsync: login, isPending } = useLogin();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Redirect if already authenticated
    if (isAuthenticated && role === "ADMIN") {
        navigate("/dashboard", { replace: true });
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            const response = await login({ email, password });
            if (response.success) {
                toast.success(response.message || "Login successful!");
                navigate("/dashboard", { replace: true });
            }
        } catch (error: any) {
            const message = error.response?.data?.error?.message || "Login failed";
            toast.error(message);
        }
    };

    return (
        <section className="flex items-center justify-center min-h-screen w-full bg-linear-to-br from-purple-50 via-pink-50 to-blue-50">
            {/* Decorative circles */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />
            <div className="absolute top-40 right-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000" />
            <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000" />
            
            <Card className="w-full max-w-md mx-4 border-0 shadow-2xl backdrop-blur-sm bg-white/90 relative z-10">
                <CardHeader className="text-center pb-2">
                    <div className="mx-auto w-16 h-16 bg-linear-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                        <Ticket className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                        Welcome Back
                    </CardTitle>
                    <CardDescription>
                        Sign in to access the admin dashboard
                    </CardDescription>
                </CardHeader>
                
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label 
                                htmlFor="email" 
                                className="text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@example.com"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition bg-gray-50/50"
                                    disabled={isPending}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label 
                                htmlFor="password" 
                                className="text-sm font-medium text-gray-700"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition bg-gray-50/50"
                                    disabled={isPending}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full py-6 bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-xl shadow-lg shadow-purple-500/25 transition-all duration-200"
                        >
                            {isPending ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing in...
                                </div>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </section>
    );
};

export default Login;
