import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MailModule } from "../mail/mail.module";
import { DocenteController } from "./docente.controller";
import { DocenteService } from "./docente.service";
import { Docente } from "./entities/docente.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([Docente]),
        MailModule
    ],
    controllers: [DocenteController],
    providers: [DocenteService],
})

export class DocenteModule {
    constructor(private docenteService: DocenteService) { }
}