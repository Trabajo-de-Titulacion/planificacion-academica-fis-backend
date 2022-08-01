import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-jwt";
import { AuthService } from "../services/auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
    constructor(
        private authservice: AuthService,
    ) {
        super({
            usernameField: 'correo',
            passwordField: 'clave'
        });
    }

    async validate(correo: string, clave: string) {
        const user = await this.authservice.validarUsuario({ correo, clave });
        if (!user) {
            throw new UnauthorizedException('not allow');
        }
        return user;
    }
}