import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getConfig } from "../services/config";

const config = getConfig();

export type AuthRequest = Request & { user?: { _id: string } };

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    // Authentication logic here
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const secret: string = config.JWT_REFRESH_SECRET;

    try {
        const decoded = jwt.verify(token, secret) as { userId: string };
        req.user = { _id: decoded.userId };
        next();
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized" });
    }
};


export default authMiddleware;