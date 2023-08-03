import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './user.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
        {name: User.name, schema: UserSchema}
    ]),
    JwtModule.register({
      global: true,
      secret: "myToken",
      signOptions: { expiresIn: '60s' },
    }),

  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
