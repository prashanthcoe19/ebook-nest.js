import { Injectable, Inject } from '@nestjs/common';

import { User } from './user.entity';
import { UserDto } from './dto/user.dto';
import { USER_REPOSITORY } from '../../core/constants';
import { UserWithoutId } from './user.interface';
import * as crypto from 'crypto';

@Injectable()
export class UsersService {
    constructor(@Inject(USER_REPOSITORY) private readonly userRepository: typeof User) { }

    async create(user: UserDto): Promise<User> {
        try{
            const verificationToken = crypto.randomBytes(20).toString('hex'); 
            const newUser: UserWithoutId = {
                ...user,
                token: verificationToken,
                token_expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
            }
            return await this.userRepository.create<User>(newUser);
        }catch(err){
            console.log(err);
        }
    }

    async findOneByEmail(email: string): Promise<User> {
        return await this.userRepository.findOne<User>({ where: { email } });
    }

    async findOneById(id: number): Promise<User> {
        return await this.userRepository.findOne<User>({ where: { id } });
    }

}
