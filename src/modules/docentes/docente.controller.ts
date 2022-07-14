import { Controller } from "@nestjs/common";
import { DocenteService } from "./docente.service";

@Controller('docente')
export class DocenteController {
    constructor(private docenteService: DocenteService) { }



}