import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from '../users/dtos/user.dto';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService : AuthService
    ){}

    @Post()
    signInLocal(
        @Body() user  : UserDto
    ){
        return this.authService.signInLocal(user);
    }

    @Post()
    signUpLocal(
        @Body() user  : UserDto
    ){
        return this.authService.signUpLocal(user);
    }
}
