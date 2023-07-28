import { Controller, Get, Post, HttpCode, HttpStatus, Body, Param, Query, Res, Req } from "@nestjs/common";
import { UserService } from "./user.service";
import { Response, Request } from "express";
import { UserRegisterRequestDTO } from "./dto/user_register_request.dto";
//localhost:3000/product
@Controller('product')
export class UserController {
    constructor(private readonly productService: UserService) { }

    @Post('register')
    async insert(@Body() body: UserRegisterRequestDTO, @Res() res: Response) {
        try {
            const responseDTO = await this.productService.register(body);
            return res.status(HttpStatus.OK).json(responseDTO);
        } catch (error: any) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }

}
