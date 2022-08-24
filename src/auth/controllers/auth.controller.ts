import { Body, Controller, Get, Param, Post, UseGuards, } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { ApiBearerAuth, ApiProperty, ApiTags } from '@nestjs/swagger';
import { CredencialesDto } from '../dtos/credenciales.dto';
import { Public } from '../decorators/public.decorator';

@ApiTags("Autenticación")
@Controller('api/auth')
export class AuthController {

    constructor(
        private readonly authService : AuthService
    ){}

    @ApiProperty({})
    @UseGuards(LocalAuthGuard)
    @Public()
    @Post("/login")
    async login(
        @Body() credenciales : CredencialesDto
    ){
        return await this.authService.generarJWT(credenciales);
    }

    @ApiProperty()
    @Public()
    @Get("/verificarToken/:access_token")
    async verificarToken(@Param('access_token') access_token: string) {
        const payload = this.authService.verificarToken(access_token);
        return {
            mensaje: 'Token válido',
        }
    }

}
