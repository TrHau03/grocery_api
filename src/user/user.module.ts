import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './user.schema';
import { MailerModule } from '@nestjs-modules/mailer';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema }
    ]),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        port: 465,
        secure: true,
        host: 'smtp.gmail.com',
        auth: {
          user: 'aaaaaahau@gmail.com',
          pass: 'xjfkcgzyhemluquh'
        }
      }
    }),
    JwtModule.register({
      global: true,
      secret: "myToken",
    }),

  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule { }
