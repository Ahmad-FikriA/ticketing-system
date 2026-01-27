import { useAuthContext } from "../../context/auth-context";
import { useGetAllTickets, useGetAllTicketTypes } from "../../lib/queries/queries";
import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import { Ticket, Users, DollarSign, CheckCircle, XCircle, Clock } from "lucide-react";

const Dashboard = () => {
    const { name } = useAuthContext();
    const { data: tickets, isLoading: ticketsLoading } = useGetAllTickets();
    const { data: ticketTypes, isLoading: typesLoading } = useGetAllTicketTypes();

    // Calculate statistics
    const stats = useMemo(() => {
        if (!tickets) return null;

        const totalTickets = tickets.length;
        const pendingTickets = tickets.filter((t) => t.status === "PENDING").length;
        const paidTickets = tickets.filter((t) => t.status === "PAID").length;
        const usedTickets = tickets.filter((t) => t.status === "USED").length;
        const cancelledTickets = tickets.filter((t) => t.status === "CANCELLED").length;

        const totalRevenue = tickets
            .filter((t) => t.status === "PAID" || t.status === "USED")
            .reduce((sum, t) => sum + t.ticketType.price, 0);

        return {
            totalTickets,
            pendingTickets,
            paidTickets,
            usedTickets,
            cancelledTickets,
            totalRevenue,
        };
    }, [tickets]);

    const isLoading = ticketsLoading || typesLoading;

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-500 rounded-full animate-spin" />
                    <p className="text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 w-full space-y-8">
            {/* Welcome Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                    Welcome back, {name}! 👋
                </h1>
                <p className="text-muted-foreground">
                    Here's what's happening with your ticketing system today.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Total Tickets"
                    value={stats?.totalTickets || 0}
                    icon={<Ticket className="h-5 w-5" />}
                    bgClass="bg-linear-to-br from-blue-100 to-blue-50"
                    iconBgClass="bg-blue-500"
                />
                <StatCard
                    title="Pending"
                    value={stats?.pendingTickets || 0}
                    icon={<Clock className="h-5 w-5" />}
                    bgClass="bg-linear-to-br from-amber-100 to-amber-50"
                    iconBgClass="bg-amber-500"
                />
                <StatCard
                    title="Paid"
                    value={stats?.paidTickets || 0}
                    icon={<DollarSign className="h-5 w-5" />}
                    bgClass="bg-linear-to-br from-emerald-100 to-emerald-50"
                    iconBgClass="bg-emerald-500"
                />
                <StatCard
                    title="Checked In"
                    value={stats?.usedTickets || 0}
                    icon={<CheckCircle className="h-5 w-5" />}
                    bgClass="bg-linear-to-br from-purple-100 to-purple-50"
                    iconBgClass="bg-purple-500"
                />
            </div>

            {/* Revenue & Cancelled Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="border-0 shadow-lg bg-linear-to-br from-emerald-400 to-teal-500 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <CardHeader className="pb-2">
                        <CardDescription className="text-emerald-100 flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Total Revenue
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">
                            Rp {(stats?.totalRevenue || 0).toLocaleString("id-ID")}
                        </p>
                        <p className="text-emerald-100 text-sm mt-2">From paid & used tickets</p>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-linear-to-br from-rose-400 to-pink-500 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <CardHeader className="pb-2">
                        <CardDescription className="text-rose-100 flex items-center gap-2">
                            <XCircle className="h-4 w-4" />
                            Cancelled Tickets
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold">{stats?.cancelledTickets || 0}</p>
                        <p className="text-rose-100 text-sm mt-2">Tickets that were cancelled</p>
                    </CardContent>
                </Card>
            </div>

            {/* Ticket Types Table */}
            <Card className="border-0 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-purple-500" />
                        Ticket Types Overview
                    </CardTitle>
                    <CardDescription>
                        Monitor your ticket inventory and sales progress
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead>Type Name</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Sold / Quota</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-50">Progress</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ticketTypes?.map((type) => {
                                const percentage = type.quota > 0
                                    ? Math.round((type.soldCount / type.quota) * 100)
                                    : 0;
                                
                                const getStatusBadge = () => {
                                    if (percentage >= 100) return <Badge variant="destructive">Sold Out</Badge>;
                                    if (percentage >= 80) return <Badge className="bg-amber-500 hover:bg-amber-600">Almost Full</Badge>;
                                    return <Badge className="bg-emerald-500 hover:bg-emerald-600">Available</Badge>;
                                };

                                return (
                                    <TableRow key={type.id}>
                                        <TableCell className="font-medium">{type.name}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            Rp {type.price.toLocaleString("id-ID")}
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-semibold">{type.soldCount}</span>
                                            <span className="text-muted-foreground"> / {type.quota}</span>
                                        </TableCell>
                                        <TableCell>{getStatusBadge()}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-500 ${
                                                            percentage >= 90
                                                                ? "bg-linear-to-r from-rose-400 to-rose-500"
                                                                : percentage >= 70
                                                                ? "bg-linear-to-r from-amber-400 to-amber-500"
                                                                : "bg-linear-to-r from-emerald-400 to-emerald-500"
                                                        }`}
                                                        style={{ width: `${Math.min(percentage, 100)}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm font-medium text-muted-foreground w-12 text-right">
                                                    {percentage}%
                                                </span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {(!ticketTypes || ticketTypes.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                        No ticket types available
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

// Stat Card Component
const StatCard = ({
    title,
    value,
    icon,
    bgClass,
    iconBgClass,
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
    bgClass: string;
    iconBgClass: string;
}) => (
    <Card className={`border-0 shadow-md ${bgClass} overflow-hidden`}>
        <CardContent className="p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <p className="text-3xl font-bold mt-1">{value}</p>
                </div>
                <div className={`${iconBgClass} p-3 rounded-xl text-white shadow-lg`}>
                    {icon}
                </div>
            </div>
        </CardContent>
    </Card>
);

export default Dashboard;