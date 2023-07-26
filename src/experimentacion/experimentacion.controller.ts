import { Controller, Get } from "@nestjs/common";
import { ExperimentacionService } from "./experimentacion.services";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "src/auth/decorators/public.decorator";


@Controller("experimentacion")
@ApiTags("ModuloExperimentacion")
export class ExperimentacionController{

    constructor( private experimentacionService: ExperimentacionService){
        
    }

    @Public()
    @Get("")
    obtenerSaludoAlejo(){
        return this.experimentacionService.getInfoAlejo()
    }

    @Public()
    @Get("info")
    obtenerInfo(){
        return this.experimentacionService.getInfo()
    }

}