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

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
        private jwtService: JwtService) {
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
            const { name, email, password, confirmPassword,phone } = requestDTO;
            if (password != confirmPassword) {
                throw new Error('PassWord and ConfirmPassWord is not match')
            }
            const hashPassWord = await bcrypt.hash(password, saltOrRounds);
            const user = new this.userModel({ name, email, password: hashPassWord,phone });
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
                access_token: await this.jwtService.signAsync({ email: user.email, name: user.name }),
                refresh_token: await this.jwtService.signAsync({ email: user.email, name: user.name },{expiresIn: '30d'}),

            };
        } catch (error: any) {
            responseDTO = { ...responseDTO, status: false, message: 'Login Failed' }
        }
        return responseDTO;
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
    async refreshToken(requestDTO: any): Promise<UserResponseDTO> {
        let responseDTO: UserResponseDTO = {
            status: true,
            message: "Refresh token successfully",
            data: null,
        }
        try {
            const { email, refreshToken } = requestDTO;
            const decode = this.jwtService.verify(refreshToken);
            if (decode.email !== email) {
                throw new Error("Refresh token is incorrect!")
            }
            responseDTO.data = {
                access_token: this.jwtService.sign({ email: decode.email, name: decode.name })
            }
        } catch (error) {
            responseDTO.data = {...responseDTO, status: false, message: "Refress token failed!"}
        }
        return responseDTO;

    }
}