import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class ProductQueryMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        if (req.path === '/get') {
            const { name, price, quantity, description } = req.query;
            if (name && !Number.isInteger(Number(name))) {
                return res.status(400).json({
                    status: false,
                    message: "Name is invalid"
                })
            }
        }
        next();
    }
}
