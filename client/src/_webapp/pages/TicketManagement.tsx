import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import { useGetAllTickets, useGetAllTicketTypes } from "../../lib/queries/queries";
import { useCheckInTicket } from "../../lib/mutations/mutations";
import type { ITicket, TicketStatus } from "../../types/types";
import { ImSpinner8 } from "react-icons/im";

const TicketManagement = () => {
    const { data: tickets, isLoading, error, refetch } = useGetAllTickets();
    const { data: ticketTypes } = useGetAllTicketTypes();
    const { mutateAsync: checkIn, isPending: isCheckingIn } = useCheckInTicket();

    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<TicketStatus | "">("");
    const [ticketTypeFilter, setTicketTypeFilter] = useState("");

    // Modal state
    const [selectedTicket, setSelectedTicket] = useState<ITicket | null>(null);

    // Filtered tickets
    const filteredTickets = useMemo(() => {
        if (!tickets) return [];

        return tickets.filter((ticket) => {
            // Search filter (code, attendee name, email)
            const searchLower = searchQuery.toLowerCase();
            const matchesSearch =
                !searchQuery ||
                ticket.ticketCode.toLowerCase().includes(searchLower) ||
                ticket.attendee.toLowerCase().includes(searchLower) ||
                ticket.user.email.toLowerCase().includes(searchLower) ||
                ticket.user.name.toLowerCase().includes(searchLower);

            // Status filter
            const matchesStatus = !statusFilter || ticket.status === statusFilter;

            // Ticket type filter
            const matchesType = !ticketTypeFilter || ticket.ticketTypeId === ticketTypeFilter;

            return matchesSearch && matchesStatus && matchesType;
        });
    }, [tickets, searchQuery, statusFilter, ticketTypeFilter]);

    // Handle check-in
    const handleCheckIn = async (ticketId: string) => {
        try {
            await checkIn(ticketId);
            toast.success("Ticket checked in successfully!");
            setSelectedTicket(null);
        } catch (error: any) {
            const message = error.response?.data?.message || "Failed to check in ticket";
            toast.error(message);
        }
    };

    // Status badge styling
    const getStatusBadge = (status: TicketStatus) => {
        const styles: Record<TicketStatus, string> = {
            PENDING: "bg-yellow-100 text-yellow-800",
            PAID: "bg-green-100 text-green-800",
            USED: "bg-blue-100 text-blue-800",
            CANCELLED: "bg-red-100 text-red-800",
        };
        return styles[status] || "bg-gray-100 text-gray-800";
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <ImSpinner8 className="animate-spin text-4xl" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <p className="text-red-500">Failed to load tickets</p>
                <button
                    onClick={() => refetch()}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-black/80"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="flex-1 w-full">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Ticket Management</h1>
                <p className="text-gray-500 mt-1">
                    Manage and view all tickets ({filteredTickets.length} of {tickets?.length || 0})
                </p>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {/* Search */}
                <div className="md:col-span-2">
                    <input
                        type="text"
                        placeholder="Search by code, attendee, or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                    />
                </div>

                {/* Status Filter */}
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as TicketStatus | "")}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none bg-white"
                >
                    <option value="">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="PAID">Paid</option>
                    <option value="USED">Used</option>
                    <option value="CANCELLED">Cancelled</option>
                </select>

                {/* Ticket Type Filter */}
                <select
                    value={ticketTypeFilter}
                    onChange={(e) => setTicketTypeFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none bg-white"
                >
                    <option value="">All Ticket Types</option>
                    {ticketTypes?.map((type) => (
                        <option key={type.id} value={type.id}>
                            {type.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Ticket Code
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Attendee
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Expiry Date
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredTickets.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        No tickets found
                                    </td>
                                </tr>
                            ) : (
                                filteredTickets.map((ticket) => (
                                    <tr key={ticket.id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-sm font-medium text-gray-900">
                                                {ticket.ticketCode}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">{ticket.attendee}</p>
                                                <p className="text-sm text-gray-500">{ticket.user.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-900">{ticket.ticketType.name}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(
                                                    ticket.status
                                                )}`}
                                            >
                                                {ticket.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {ticket.expiryDate
                                                ? new Date(ticket.expiryDate).toLocaleDateString("id-ID", {
                                                      day: "numeric",
                                                      month: "short",
                                                      year: "numeric",
                                                  })
                                                : "-"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setSelectedTicket(ticket)}
                                                    className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition"
                                                >
                                                    View
                                                </button>
                                                {ticket.status === "PAID" && (
                                                    <button
                                                        onClick={() => handleCheckIn(ticket.id)}
                                                        disabled={isCheckingIn}
                                                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition"
                                                    >
                                                        Check In
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedTicket && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Ticket Details</h2>
                            <button
                                onClick={() => setSelectedTicket(null)}
                                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded-lg p-4 text-center">
                                <p className="text-sm text-gray-500 mb-1">Ticket Code</p>
                                <p className="font-mono text-2xl font-bold text-gray-900">
                                    {selectedTicket.ticketCode}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <span
                                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-1 ${getStatusBadge(
                                            selectedTicket.status
                                        )}`}
                                    >
                                        {selectedTicket.status}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Ticket Type</p>
                                    <p className="font-medium text-gray-900">{selectedTicket.ticketType.name}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Attendee</p>
                                <p className="font-medium text-gray-900">{selectedTicket.attendee}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Buyer Name</p>
                                    <p className="font-medium text-gray-900">{selectedTicket.user.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Buyer Email</p>
                                    <p className="font-medium text-gray-900">{selectedTicket.user.email}</p>
                                </div>
                            </div>

                            {selectedTicket.user.phone && (
                                <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="font-medium text-gray-900">{selectedTicket.user.phone}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Price</p>
                                    <p className="font-medium text-gray-900">
                                        Rp {selectedTicket.ticketType.price.toLocaleString("id-ID")}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Expiry Date</p>
                                    <p className="font-medium text-gray-900">
                                        {selectedTicket.expiryDate
                                            ? new Date(selectedTicket.expiryDate).toLocaleDateString("id-ID", {
                                                  day: "numeric",
                                                  month: "long",
                                                  year: "numeric",
                                              })
                                            : "-"}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Created At</p>
                                <p className="font-medium text-gray-900">
                                    {new Date(selectedTicket.createdAt).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex gap-3">
                            {selectedTicket.status === "PAID" && (
                                <button
                                    onClick={() => handleCheckIn(selectedTicket.id)}
                                    disabled={isCheckingIn}
                                    className="flex-1 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition font-medium"
                                >
                                    {isCheckingIn ? "Checking in..." : "Check In"}
                                </button>
                            )}
                            <button
                                onClick={() => setSelectedTicket(null)}
                                className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TicketManagement;
