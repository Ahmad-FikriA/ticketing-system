import midtransClient from "midtrans-client";

const config = {
    isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
    serverKey: process.env.MIDTRANS_SERVER_KEY || "",
    clientKey: process.env.MIDTRANS_CLIENT_KEY || "",
};

// Midtrans Snap API instance (for creating transactions)
export const snap = new midtransClient.Snap(config);

// Midtrans Core API instance (for transaction status & notifications)
// Using type assertion due to incomplete type definitions in @types/midtrans-client
export const coreApi = new midtransClient.CoreApi(config) as midtransClient.CoreApi & {
    transaction: {
        notification: (notificationJson: any) => Promise<any>;
        status: (orderId: string) => Promise<any>;
    };
};

// Export client key for frontend
export const clientKey = process.env.MIDTRANS_CLIENT_KEY || "";
