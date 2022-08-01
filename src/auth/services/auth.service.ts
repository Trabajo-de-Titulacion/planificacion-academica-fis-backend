import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioEntity } from 'src/usuarios/entities/usuario.entity';
import { UsuarioService } from 'src/usuarios/services/usuario.service';
import { Repository } from 'typeorm';
import { UsuarioDto } from '../../usuarios/dtos/usuario.dto';
import { CredencialesDto } from '../dtos/credenciales.dto';
import * as bcrypt from 'bcrypt';
import { PayloadToken } from '../models/token.model';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UsuarioEntity) private userRepository : Repository<UsuarioEntity>,
        private servicioUsuario : UsuarioService,
        private jwtServicio : JwtService
    ){}

    async validarUsuario( credencialesUsuario : CredencialesDto){
        const usuario = await this.servicioUsuario.obtenerUsuarioPorSuCorreo(credencialesUsuario.correo);
        if(usuario){
            return await bcrypt.compare(credencialesUsuario.clave, usuario.clave) ? {id: usuario.id, correo: usuario.correo} : null;
        }else{
            return null;
        }
    }

    generarJWT(usuario: UsuarioEntity){
        const payload : PayloadToken = { sub: usuario.id }
        return {
            access_token: this.jwtServicio.sign(payload),
        }
    }
}
