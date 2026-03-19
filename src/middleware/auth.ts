import { NextFunction, Request, Response } from "express";
import {auth as betterAuth} from "../lib/auth"
 
export enum UserRole {
    USER = "User",
    ADMIN = "Admin"
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string,
                name: string,
                email: string,
                role: string,
                emailVerified: boolean
            }
        }
    }
}


const auth = (...roles: UserRole[]) => {
    console.log(roles);
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const session = await betterAuth.api.getSession({
                headers: req.headers as any
            })
            if (!session) {
                return res.status(404).json({
                    success: false,
                    message: "you are not authorized"
                });
            }
            if (!session.user.emailVerified) {
                return res.status(403).json({
                    success: false,
                    message: "email should be verified"
                });
            }

            req.user = {
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
                role: session.user.role as string,
                emailVerified: session.user.emailVerified
            }

            // Normalize role for comparison
            //   const userRole = req.user.role.toUpperCase();
            //   const allowedRoles = roles.map(r => r.toUpperCase());

            if (roles.length && !roles.includes(req.user.role as UserRole)) {
                return res.status(403).json({
                    success: false,
                    message: "u don't have permission"
                });
            }
            next()
        } catch (err) {
            next(err)
        }
    }
}

export default auth;