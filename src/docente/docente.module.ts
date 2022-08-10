import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MailModule } from "../mail/mail.module";
import { DocenteController } from "./controllers/docente.controller";
import { DocenteService } from "./services/docente.service";
import { DocenteEntity } from "./entities/docente.entity";
import { UsuariosModule } from "../usuarios/usuarios.module";
import { RolEntity } from "../auth/entities/rol.entity";
import { AuthModule } from "../../src/auth/auth.module";
import { RolService } from "../../src/auth/services/rol.service";
import RolUsuarioService from "../../src/auth/services/rol-usuario.service";
import { UsuarioService } from "../../src/usuarios/services/usuario.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([DocenteEntity, RolEntity]),
        MailModule,
        UsuariosModule,
        AuthModule
    ],
    exports:[MailModule, UsuarioService, RolService, RolUsuarioService],
    controllers: [DocenteController],
    providers: [DocenteService, RolService, RolUsuarioService, UsuarioService]
})

export class DocenteModule {
    constructor(private docenteService: DocenteService) { }
}