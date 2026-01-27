export type ILogin = {
    email: string;
    password: string;
}

export type Role = "ADMIN" | "USER" | null;

export type IUser = {
    id: string;
    email: string;
    name: string;
    role: Role;
}

export type LoginResponse = {
    success: boolean;
    message: string;
    data: IUser;
}

export type ICreateUser = {
    email: string;
    password: string;
    name: string;
    role: Role;
}

// Ticket Types
export type TicketStatus = "PENDING" | "PAID" | "USED" | "CANCELLED";

export type ITicketType = {
    id: string;
    name: string;
    price: number;
    quota: number;
    soldCount: number;
}

export type ITicket = {
    id: string;
    ticketCode: string;
    status: TicketStatus;
    attendee: string;
    expiryDate: string | null;
    createdAt: string;
    userId: string;
    ticketTypeId: string;
    user: {
        id: string;
        name: string;
        email: string;
        phone: string | null;
    };
    ticketType: ITicketType;
    isExpired?: boolean;
}

export type ITicketFilters = {
    search?: string;
    status?: TicketStatus | "";
    ticketTypeId?: string;
}