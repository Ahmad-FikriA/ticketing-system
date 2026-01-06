import dotenv from "dotenv";

dotenv.config();

// Coerce PORT to number with a safe default to avoid ERR_SOCKET_BAD_PORT.
export const port = Number(process.env.PORT) || 3000;
export const access_jwt_secret = process.env.ACCESS_JWT_SECRET;