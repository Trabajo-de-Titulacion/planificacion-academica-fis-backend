import { Controller, Post, Request, UseGuards, } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UsuarioEntity } from 'src/usuarios/entities/usuario.entity';
import { LocalAuthGuard } from '../guards/local-auth.guard';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService : AuthService
    ){}

    @UseGuards(LocalAuthGuard)
    @Post()
    signInLocal(
        @Request() request
    ){
        const usuario = request.usuario as UsuarioEntity
        return this.authService.generarJWT(usuario);
    }

}
