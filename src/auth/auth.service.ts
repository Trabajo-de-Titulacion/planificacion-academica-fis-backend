import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEntity } from 'src/usuarios/entities/usuario.entity';
import { Repository } from 'typeorm';
import { UserDto } from '../usuarios/dtos/user.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UsuarioEntity) private userRepository : Repository<UsuarioEntity>
    ){}

    signInLocal(user  : UserDto){

    }

    signUpLocal(user  : UserDto){

    }
}
