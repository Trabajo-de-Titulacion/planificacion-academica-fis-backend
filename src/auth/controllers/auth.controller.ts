import { Body, Controller, Post, Request, UseGuards, } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UsuarioEntity } from 'src/usuarios/entities/usuario.entity';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { CredencialesDto } from '../dtos/credenciales.dto';

@ApiTags("Autenticación")
@Controller('api/auth')
export class AuthController {

    constructor(
        private readonly authService : AuthService
    ){}

    @ApiProperty({})
    @UseGuards(LocalAuthGuard)
    @Post("/login")
    login(
        @Body() credenciales : CredencialesDto
    ){
        const usuario = credenciales as UsuarioEntity
        return this.authService.generarJWT(usuario);
    }

}
