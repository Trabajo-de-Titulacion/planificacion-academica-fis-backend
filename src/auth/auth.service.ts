import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserDto } from '../users/dtos/user.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository : Repository<User>
    ){}

    signInLocal(user  : UserDto){

    }

    signUpLocal(user  : UserDto){

    }
}
