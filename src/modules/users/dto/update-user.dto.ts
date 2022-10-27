import { PartialType } from '@nestjs/mapped-types';
import { User } from "@modules/users/entities/user.entity";

export class UpdateUserDto extends PartialType(User) {}
