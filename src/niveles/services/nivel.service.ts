import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CarreraEntity } from "../../../src/carrera/entities/carrera.entity";
import { CarreraService } from "../../../src/carrera/services/carrera.service";
import { Repository } from "typeorm";
import { NivelDto } from "../dto/nivel.dto";
import { NivelEntity } from "../entities/nivel.entity";


@Injectable()
export class NivelService {

    constructor(
        @InjectRepository(NivelEntity) private nivelRepository: Repository<NivelEntity>,
        private carreraService: CarreraService,
    ) { }

    async crearNivel(nivel: NivelDto) {
        const nivelACrear = this.nivelRepository.create(nivel);
        const carrera = await this.carreraService.obtenerCarreraPorID(nivel.idCarrera);
        if (carrera instanceof CarreraEntity) {
            nivelACrear.carrera = carrera;
            return this.nivelRepository.save(nivelACrear);
        }
    }

    async obtenerTodosLosNiveles() {
        return await this.nivelRepository.find({ relations: ["carrera"] });
    }

    async obtenerNivelPorId(idNivel: string) {
        return await this.nivelRepository.findOne(idNivel);
    }

    async obtenerNivelPorNombre(nombre: string) {
        return await this.nivelRepository.findOne({ where: nombre })
    }

    eliminarNivel(idNivel: string) {
        return this.nivelRepository.delete(idNivel);
    }
}