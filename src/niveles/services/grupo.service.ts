import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GrupoDto } from '../dto/grupo.dto';
import { GrupoEntity } from '../entities/grupo.entity';
import { NivelService } from './nivel.service';

@Injectable()
export class GrupoService {
  constructor(
    @InjectRepository(GrupoEntity)
    private grupoRepositorio: Repository<GrupoEntity>,
    private nivelService: NivelService,
  ) {}

  async crearGrupo(grupo: GrupoDto) {
    const grupoACrear = this.grupoRepositorio.create(grupo);
    const nivel = await this.nivelService.obtenerNivelPorId(grupo.idNivel);
    if (nivel) {
      grupoACrear.nivel = nivel;
      return this.grupoRepositorio.save(grupoACrear);
    } else {
      return 'No existe el nivel';
    }
  }

  async obtenerGruposPorIdNivel(idNivel: string) {
    const nivel = await this.nivelService.obtenerNivelPorId(idNivel);
    if (nivel) {
      return this.grupoRepositorio.find({ where: { nivel: { id: idNivel } } });
    }
  }

  async obtenerTodosLosGrupos() {
    return this.grupoRepositorio.find();
  }

  async obtenerGrupoPorID(id: string) {
    return await this.grupoRepositorio.findOne({ id: id });
  }
}
