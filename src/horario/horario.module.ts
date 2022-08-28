import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HorarioController } from "./controllers/horario.controller";
import { HorarioEntity } from "./entities/horario.entity";
import { HorarioService } from "./services/horario.service";

@Module({
    imports: [TypeOrmModule.forFeature([HorarioEntity])],
    controllers: [HorarioController],
    providers: [HorarioService],
})
export class HorarioModule {}