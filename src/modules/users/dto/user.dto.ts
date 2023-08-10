import { User } from "@modules/users/entities/user.entity";
import { PartialType } from '@nestjs/mapped-types';

export class UserDto extends PartialType(User) {}

export interface EmailLogin {
  email: string;
  password: string;
}
