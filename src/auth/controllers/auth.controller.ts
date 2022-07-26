import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UsuarioDto } from '../../usuarios/dtos/usuario.dto';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService : AuthService
    ){}

    @Post()
    signInLocal(
        @Body() user  : UsuarioDto
    ){
        return this.authService.signInLocal(user);
    }

    @Post()
    signUpLocal(
        @Body() user  : UsuarioDto
    ){
        return this.authService.signUpLocal(user);
    }
}
