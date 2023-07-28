//model gửi
import { User  } from "../user.entity";
export class UserRegisterRequestDTO extends User {
    confirmPassWord: string;
}