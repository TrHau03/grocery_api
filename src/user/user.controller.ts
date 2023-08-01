import { Controller, Get, Post, HttpCode, HttpStatus, Body, Param, Query, Res, Req } from "@nestjs/common";
import { UserService } from "./user.service";
import { Response, Request } from "express";
import { UserRegisterRequestDTO } from "./dto/user_register_request.dto";
import { UserLoginRequestDTO } from "./dto/user_login_request.dto";
//localhost:3000/product
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('register')
    async register(@Body() body: UserRegisterRequestDTO, @Res() res: Response) {
        try {
            const responseDTO = await this.userService.register(body);
            return res.status(HttpStatus.OK).json(responseDTO);
        } catch (error: any) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }
    @Get('login')
    async  login(@Body() body: UserLoginRequestDTO, @Res() res: Response){
        try {
            const responseDTO = await this.userService.login(body);
            return res.status(HttpStatus.OK).json(responseDTO);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
            
        }
    }

}
