import { User } from "@modules/users/entities/user.entity";
import { FindOneOptions } from "typeorm";


// this is a temporary solution/hack for presentation
export function findUserByEmail(email: string): FindOneOptions<User> {
  return {
    where: {
      email: email
    },
    // select: {
    //   id: true,
    // },
    // relations: {
    //   tags: true
    // }
  }
}
