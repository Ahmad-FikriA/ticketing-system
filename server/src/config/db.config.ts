import dotenv from "dotenv";

export const port = Number(process.env.PORT);
export const access_jwt_secret = process.env.ACCESS_JWT_SECRET