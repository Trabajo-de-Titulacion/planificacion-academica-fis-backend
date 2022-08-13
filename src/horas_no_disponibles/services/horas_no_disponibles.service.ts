import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DocenteService } from '../../../src/docente/services/docente.service';
import { JornadaLaboralService } from '../../../src/parametros-iniciales/services/jornada-laboral.service';
import { Repository } from 'typeorm';
import { HorasNoDisponiblesDTO } from '../dto';
import { HoraNoDisponibleEntity } from '../entities/hora_no_disponible.entity';

@Injectable()
export class HorasNoDisponiblesService {

  constructor(
    @InjectRepository(HoraNoDisponibleEntity)
    private horasNoDisponiblesRepository: Repository<HoraNoDisponibleEntity>,
    private jornadasLaboralesService: JornadaLaboralService,
    private docentesService: DocenteService,
  ) {}

  /* Read */
  async obtenerHorasNoDisponiblesPorDocenteId(id: string) {
    const docente = await this.docentesService.obtenerDocentePorID(id);
    if (docente instanceof NotFoundException) {
      throw new HttpException('No se encontró el docente.', HttpStatus.BAD_REQUEST);
    }
    return await this.horasNoDisponiblesRepository.find({
      where: { docente: docente }
    });;
  }

  /* Create */
  async crearHoraNoDisponible(hora_no_disponible: HorasNoDisponiblesDTO) {
    // Configuraciones iniciales
    /*const hora_min = 7;
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
      */
      const respuesta = {
        filas_alteradas: 1,
        //registro_creado: registro_creado
      }

      return respuesta;
    //}
    /*
    const respuestaAlNoregistrar = {
      filas_alteradas: 0
    }

    return respuestaAlNoregistrar;*/
  }

  async crearHorasNoDisponibles(horas_no_disponibles: HorasNoDisponiblesDTO[]) {
    // Docente
    const docente = await this.docentesService.obtenerDocentePorID(horas_no_disponibles[0].docente_id);
    if (docente instanceof NotFoundException) {
      throw new HttpException('No se encontró el docente.', HttpStatus.BAD_REQUEST);
    }

    const registrosCorrectos: HoraNoDisponibleEntity[] = [];
    const registrosErroneos: HorasNoDisponiblesDTO[] = [];
    for (let horaDTO of horas_no_disponibles) {
      // Configuraciones iniciales
      const jornada = await this.jornadasLaboralesService.obtenerJornadaPorId(horaDTO.dia_id);
      if (!jornada) {
        registrosErroneos.push(horaDTO);
        continue;
      }
      const horaMinima = Number(jornada.horaInicio.split(':')[0]);
      const horaMaxima = Number(jornada.horaFin.split(':')[0]);
      const horaAlmuerzo = Number(jornada.horaAlmuerzo.split(':')[0]);

      // Filtrar de acuerdo a las configuraciones
      if ((horaDTO.hora_inicio >= horaMinima) &&
          (horaDTO.hora_inicio <= horaMaxima - 1) &&
          (horaDTO.hora_inicio != horaAlmuerzo))
      {
        const horaARegistrar = this.horasNoDisponiblesRepository.create({
          docente: docente,
          dia: jornada,
          hora_inicio: horaDTO.hora_inicio,
        });
        registrosCorrectos.push(horaARegistrar);
      } else {
        registrosErroneos.push(horaDTO);
      }
    }

    if (registrosCorrectos.length > 0) {
      const registrosCreados = await this.horasNoDisponiblesRepository.save(registrosCorrectos);

      return {
        filas_alteradas: registrosCreados.length,
        mensaje: `Se han creado ${registrosCreados.length} registros. Hay ${registrosErroneos.length} erróneos.`,
        registros_creados: registrosCreados,
        registrosErroneos: registrosErroneos,
      }
    }
    return {
      filas_alteradas: 0,
      mensaje: `Los datos enviados son erróneos. Verifique si los días y horas seleccionadas pertenecen a la jornada laboral.`,
      registros_creados: [],
    }
  }

  /* Delete */
  async eliminarHorasNoDisponiblesPorDocenteId(id: string) {
    /*const docente = await this.docenteService.obtenerDocentePorID(id);
    if (docente instanceof NotFoundException) {
      return new HttpException('No se encontró el docente.', HttpStatus.BAD_REQUEST);
    }*/
    return await this.horasNoDisponiblesRepository.delete({
      //docente_id: docente
    });
  }

}