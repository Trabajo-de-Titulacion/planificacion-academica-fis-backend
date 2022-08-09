import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MailModule } from "../mail/mail.module";
import { DocenteController } from "./controllers/docente.controller";
import { DocenteService } from "./services/docente.service";
import { DocenteEntity } from "./entities/docente.entity";
import { UsuariosModule } from "../usuarios/usuarios.module";
import { RolEntity } from "../auth/entities/rol.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([DocenteEntity, RolEntity]),
        MailModule,
        UsuariosModule
    ],
    controllers: [DocenteController],
    providers: [DocenteService]
})

export class DocenteModule {
    constructor(private docenteService: DocenteService) { }
}