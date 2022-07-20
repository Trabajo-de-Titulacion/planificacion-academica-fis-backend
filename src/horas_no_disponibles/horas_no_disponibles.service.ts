import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HorasNoDisponiblesDTO } from './dto';
import { HoraNoDisponible } from './entities/hora_no_disponible.entity';

@Injectable()
export class HorasNoDisponiblesService {

  constructor(
    @InjectRepository(HoraNoDisponible)
    private horasNoDisponiblesRepository: Repository<HoraNoDisponible>
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
      const registro_creado = await this.horasNoDisponiblesRepository.save(hora_no_disponible);

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

    const registros_creados = await this.horasNoDisponiblesRepository.save(horas_a_registrar);

    const respuesta = {
      filas_alteradas: registros_creados.length,
      registros_creados: registros_creados
    }

    return respuesta;
  }

  /* Delete */
  async eliminarHorasNoDisponiblesPorDocenteId(id: string) {
    return await this.horasNoDisponiblesRepository.delete({
      docente_id: id
    });
  }

}