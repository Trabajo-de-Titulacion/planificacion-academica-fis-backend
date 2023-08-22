import { Module } from "@nestjs/common";
import { ExperimentacionController } from "./experimentacion.controller";
import { ExperimentacionService } from "./experimentacion.service";

@Module({
    controllers: [ExperimentacionController],
    providers: [ExperimentacionService]
})
export class ExperimentacionModule{}
