import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DocenteService } from 'src/docente/services/docente.service';
import { Repository } from 'typeorm';
import { HorasNoDisponiblesDTO } from '../dto';
import { HoraNoDisponibleEntity } from '../entities/hora_no_disponible.entity';

@Injectable()
export class HorasNoDisponiblesService {

  constructor(
    @InjectRepository(HoraNoDisponibleEntity)
    private horasNoDisponiblesRepository: Repository<HoraNoDisponibleEntity>,
    private docenteService: DocenteService,
  ) {}

  /* Read */
  async obtenerHorasNoDisponiblesPorDocenteId(id: string) {
    return await this.horasNoDisponiblesRepository.find({
      where: {docenteId: id}
    });;
  }

  /* Create */
  async crearHoraNoDisponible(hora_no_disponible: HorasNoDisponiblesDTO) {
    // Configuraciones iniciales
    const hora_min = 7;
    const hora_max = 20;
    const hora_almuerzo = 13;

    // Filtrar de acuerdo a las configuraciones
    if (
      (hora_no_disponible.hora_inicio >= hora_min) && 
      (hora_no_disponible.hora_inicio <= hora_max) && 
      (hora_no_disponible.hora_inicio != hora_almuerzo)
    ) {
      const docente = await this.docenteService.obtenerDocentePorID(hora_no_disponible.docente_id);
      if (docente instanceof NotFoundException) {
        throw new HttpException('No se encontró el docente.', HttpStatus.BAD_REQUEST);
      }

      const entidad_a_registrar: HoraNoDisponibleEntity = {
        id: '',
        dia: hora_no_disponible.dia,
        hora_inicio: hora_no_disponible.hora_inicio,
        docente_id: docente,
      };

      const registro_creado = await this.horasNoDisponiblesRepository.save(entidad_a_registrar);

      const respuesta = {
        filas_alteradas: 1,
        registro_creado: registro_creado
      }

      return respuesta;
    }

    const respuestaAlNoregistrar = {
      filas_alteradas: 0
    }

    return respuestaAlNoregistrar;
  }

  async crearHorasNoDisponibles(horas_no_disponibles: HorasNoDisponiblesDTO[]) {
    // Configuraciones iniciales
    const hora_min = 7;
    const hora_max = 20;
    const hora_almuerzo = 13;

    // Filtrar de acuerdo a las configuraciones
    const horas_a_registrar = horas_no_disponibles.filter((hora) => {
      return (hora.hora_inicio >= hora_min) && (hora.hora_inicio <= hora_max) && (hora.hora_inicio != hora_almuerzo);
    });

    const entidades_a_registrar = await Promise.all(
      horas_a_registrar.map(async (horaDto) => {

        const docente = await this.docenteService.obtenerDocentePorID(horaDto.docente_id);
        if (docente instanceof NotFoundException) {
          throw new HttpException('No se encontró el docente.', HttpStatus.BAD_REQUEST);
        }

        const entidadHora: HoraNoDisponibleEntity = {
          id: '',
          dia: horaDto.dia,
          hora_inicio: horaDto.hora_inicio,
          docente_id: docente,
        };
        return entidadHora;
    }));

    const registros_creados = await this.horasNoDisponiblesRepository.save(entidades_a_registrar);

    const respuesta = {
      filas_alteradas: registros_creados.length,
      registros_creados: registros_creados
    }

    return respuesta;
  }

  /* Delete */
  async eliminarHorasNoDisponiblesPorDocenteId(id: string) {
    const docente = await this.docenteService.obtenerDocentePorID(id);
    if (docente instanceof NotFoundException) {
      return new HttpException('No se encontró el docente.', HttpStatus.BAD_REQUEST);
    }
    return await this.horasNoDisponiblesRepository.delete({
      docente_id: docente
    });
  }

}