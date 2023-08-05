import { Controller, Get, Post, HttpCode, HttpStatus, Body, Param, Query, Res, Req ,UseGuards,Render } from "@nestjs/common";
import { UserService } from "./user.service";
import { Response, Request } from "express";
import { UserRegisterRequestDTO } from "./dto/user_register_request.dto";
import { UserLoginRequestDTO } from "./dto/user_login_request.dto";
import { AuthGuard } from "src/middleware/guard.middleware";
import { log } from "console";
import { UserforgotPassword } from "./dto/user_forgotpassword_request.dto";
//localhost:3000/product
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('sendMail')
    sendMail(@Body() body: UserforgotPassword){
        try {
        return this.userService.sendMail(body);
        } catch (error :any) {
            log(error)
        }
    }
    @Post('register')
    async register(@Body() body: UserRegisterRequestDTO, @Res() res: Response) {
        try {
            console.log(body);
            const responseDTO = await this.userService.register(body);
            return res.status(HttpStatus.OK).json(responseDTO);
        } catch (error: any) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
        }
    }


    @Post('login')
    async  login(@Body() body: UserLoginRequestDTO, @Res() res: Response){
        try {
            const responseDTO = await this.userService.login(body);
            return res.status(HttpStatus.OK).json(responseDTO);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
            
        }
    }


    @UseGuards(AuthGuard)
    @Get('getAllUser')
    async  getAllUser(@Res() res: Response){
        try {
            const responseDTO = await this.userService.getAllUser();
            return res.status(HttpStatus.OK).json(responseDTO);
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
            
        }
    }

    @Post('refresh_token')
    async refreshToken(@Body() body : any, @Res() res: Response){
        try {
            let responseDTO = await this.userService.refreshToken(body);
            return res.status(HttpStatus.OK).json(responseDTO);
        } catch (error :any) {
            return res.status(HttpStatus.BAD_REQUEST).json(error);
            
        }
    }

    //web
    @Get('home')
    @Render('index')
    async home(@Res() res: Response){
        return{ text: "Hello Word!"}
    }

}
