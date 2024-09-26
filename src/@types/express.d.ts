import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string; // Aquí defines que `userId` puede ser parte de la solicitud
    }
  }
}