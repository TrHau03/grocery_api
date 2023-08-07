//service: xử lí logic, tương tác với database

import { Get, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from './user.schema';
import { UserLoginRequestDTO } from './dto/user_login_request.dto';
import { UserRegisterRequestDTO } from './dto/user_register_request.dto';
import { UserResponseDTO } from './dto/user_response.dto';
import { UserforgotPassword } from './dto/user_forgotpassword_request.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { log } from 'console';
@Injectable()
export class UserService {
    constructor(@InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
        private jwtService: JwtService,
        private readonly mailerService: MailerService,
    ) {
    }
    async sendMail(requestDTO: UserforgotPassword): Promise<any> {
        let responseDTO: UserResponseDTO = {
            status: true,
            message: "Get User Successfully",
            data: null,
        };
        try {
            const { email } = requestDTO;
            console.log(email);

            const code = Math.floor(Math.random() * 1000000);
            this.mailerService.sendMail({
                to: email,
                from: 'aaaaaahau@gmail.com',
                subject: 'Testing Mail',
                text: 'welcome',
                html: "<h1>Your code : " + code + "<h1/>",
            });
            responseDTO = { ...responseDTO, data: code }
            return responseDTO;
        } catch (error: any) {
            responseDTO = { ...responseDTO, status: false }
            return responseDTO;
        }
    }
    //Hàm insert vào database
    async register(requestDTO: UserRegisterRequestDTO): Promise<UserResponseDTO> {
        const saltOrRounds = 10;
        let responseDTO: UserResponseDTO = {
            status: true,
            message: 'Register completed',
            data: null
        }
        try {
            console.log(requestDTO);
            const { name, email, password, confirmPassword, phone } = requestDTO;
            if (password != confirmPassword) {
                throw new Error('PassWord and ConfirmPassWord is not match')
            }
            const hashPassWord = await bcrypt.hash(password, saltOrRounds);
            const user = new this.userModel({ name, email, password: hashPassWord, phone });
            console.log(user);

            await user.save();
        } catch (error: any) {
            responseDTO = { ...responseDTO, status: false, message: 'Register Failed' }
        }
        return responseDTO;
    }
    async login(requestDTO: UserLoginRequestDTO): Promise<UserResponseDTO> {
        let responseDTO: UserResponseDTO = {
            status: true,
            message: 'Login completed',
            data: null
        }
        try {
            const { email, password } = requestDTO;
            console.log(email, password);
            
            const user = await this.userModel.findOne({ email });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!user) {
                throw new Error("Email or Password is incorrect!");
            }
            if (!isMatch) {
                throw new Error("Email or Password is incorrect!")
            }
            responseDTO.data = {
                user: user,
                access_token: await this.jwtService.sign({ email: user.email, name: user.name },  { expiresIn: 10 }),
                refresh_token: await this.jwtService.sign({ email: user.email, name: user.name }, { expiresIn: '30d' }),

            };
        } catch (error: any) {
            responseDTO = { ...responseDTO, status: false, message: 'Login Failed' }
        }
        return responseDTO;
    }
    async checkToken(requestDTO: any): Promise<any> {
        const { access_token } = requestDTO;
        let responseDTO: UserResponseDTO = {
            status: true,
            message: 'Login completed',
            data: null
        }
        try {
            const token = this.jwtService.verify(access_token);
            console.log(token);
            if(token == null){
                responseDTO.status = false;
            }
        return responseDTO;
        } catch (error) {
            return error;
        }
    }
    async getAllUser(): Promise<UserResponseDTO> {
        try {

            const user = await this.userModel.find();
            const responseDTO: UserResponseDTO = {
                status: true,
                message: "Get User Successfully",
                data: user
            };
            return responseDTO;
        } catch (error: any) {
            console.log("Get User Failed", error);
        }
    }
    async forgotPassword(requestDTO: UserforgotPassword): Promise<UserResponseDTO> {
        try {
            const { email } = requestDTO;
            return null;
        } catch (error: any) {
            console.log(error);

        }
    }
    async refreshToken(requestDTO: any): Promise<UserResponseDTO> {
        let responseDTO: UserResponseDTO = {
            status: true,
            message: "Refresh token successfully",
            data: null,
        }
        try {
            const { email, refreshToken } = requestDTO;
            console.log(refreshToken);

            const decode = this.jwtService.verify(refreshToken);
            console.log(decode);

            if (decode.email !== email) {
                throw new Error("Refresh token is incorrect!")
            }
            responseDTO.data = {
                access_token: this.jwtService.sign({ email: decode.email, name: decode.name })
            }
        } catch (error) {
            responseDTO = { ...responseDTO, status: false, message: "Refress token failed!" }
        }
        return responseDTO;

    }
}