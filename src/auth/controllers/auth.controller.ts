import { Body, Controller, Post, Request, UseGuards, } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
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

}
