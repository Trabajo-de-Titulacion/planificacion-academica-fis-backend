import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEntity } from 'src/usuarios/entities/usuario.entity';
import { Repository } from 'typeorm';
import { UsuarioDto } from '../../usuarios/dtos/usuario.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UsuarioEntity) private userRepository : Repository<UsuarioEntity>
    ){}

    signInLocal(user  : UsuarioDto){

    }

    signUpLocal(user  : UsuarioDto){

    }
}
