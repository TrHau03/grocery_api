//service: xử lí logic, tương tác với database

import { Get, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { UserLoginRequestDTO } from './dto/user_login_request.dto';
import { UserRegisterRequestDTO } from './dto/user_register_request.dto';
import { UserResponseDTO } from './dto/user_response.dto';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name)
    private readonly userModel: Model<UserDocument>) {
    }
    //Hàm insert vào database
    async register(requestDTO: UserRegisterRequestDTO): Promise<UserResponseDTO> {
        let responseDTO: UserResponseDTO = {
            status: true,
            message: 'Register completed',
            data: null
        }
        try {
            const { name, email, password, phone, confirmPassWord } = requestDTO;
            if (password !== confirmPassWord) {
                throw new Error('PassWord and ConfirmPassWord is not match')
            }
            const user = new this.userModel({ name, email, password, phone });
            await user.save();
        } catch (error: any) {
            responseDTO = { ...responseDTO, status: false, message: 'Register Failed' }
        }
        return responseDTO;
    }

}