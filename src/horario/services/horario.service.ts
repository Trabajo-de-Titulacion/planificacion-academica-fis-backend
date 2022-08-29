import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsuarioService } from "src/usuarios/services/usuario.service";
import { Repository } from "typeorm";
import { HorarioDto } from "../dto/horario.dto";
import { HorarioEntity } from "../entities/horario.entity";

@Injectable()
export class HorarioService{

    constructor(
        @InjectRepository(HorarioEntity) private repositorioHorario : Repository<HorarioEntity>,
        private usuarioService : UsuarioService,
    ){}

    async crearHorario(horario : HorarioDto){
        const usuario = await this.usuarioService.obtenerUsuarioCompletoPorSuID(horario.idUsuario);
        if(usuario){
            const horarioNuevo = this.repositorioHorario.create(horario);
            horarioNuevo.usuario =  usuario;
        }
    }
}