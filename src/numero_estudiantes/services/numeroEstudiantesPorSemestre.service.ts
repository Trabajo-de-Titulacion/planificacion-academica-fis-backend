import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SemestreService } from '../../../src/parametros-iniciales/services/semestre.service';
import { Repository } from 'typeorm';
import { isUUID, validate } from 'class-validator';
import { NumeroEstudiantesPorSemestreDTO } from '../dto/numeroEstudiantesPorSemestre.dto';
import { NumeroEstudiantesPorSemestreEntity } from '../entities/numeroEstudiantesPorSemestre.entity';
import { plainToInstance } from 'class-transformer';
import { AsignaturaService } from '../../../src/asignatura/services/asignatura.service';


@Injectable()
export class NumeroEstudiantesPorSemestreService {

  constructor(
    @InjectRepository(NumeroEstudiantesPorSemestreEntity)
    private numeroEstudiantesPorSemestreRepository: Repository<NumeroEstudiantesPorSemestreEntity>,
    private semestreService: SemestreService,
    private asignaturaService: AsignaturaService,
  ) {}

  async registrarNumeroEstudiantesPorSemestre(arregloNumeroEstudiantesPorSemestre: NumeroEstudiantesPorSemestreDTO[]) {
    await this.comprobarArregloDeNumeroEstudiantesPorSemestre(arregloNumeroEstudiantesPorSemestre);
    // Buscar semestre en progreso
    const semestreEnProgreso = await this.semestreService.obtenerSemestreConPlanificacionEnProgreso();
    if (!semestreEnProgreso) {
      throw new HttpException('No hay un semestre con planificacion en progreso.', HttpStatus.BAD_REQUEST);
    }
    if (semestreEnProgreso.id != arregloNumeroEstudiantesPorSemestre[0].idSemestre) {
      throw new HttpException('El semestre indicado no se encuentra en progreso.', HttpStatus.BAD_REQUEST);
    }
    const entidadesARegistrar: NumeroEstudiantesPorSemestreEntity[] = [];
    for (let elemento of arregloNumeroEstudiantesPorSemestre) {
      const asignatura = await this.asignaturaService.obtenerAsignaturaPorID(elemento.idAsignatura);
      if (asignatura instanceof NotFoundException) {
        throw new HttpException('No se encontraron las asignaturas indicadas.', HttpStatus.BAD_REQUEST);
      }
      const entidad = this.numeroEstudiantesPorSemestreRepository.create({
        semestre: semestreEnProgreso,
        asignatura: asignatura,
        numeroEstudiantes: elemento.numeroEstudiantes,
      });
      entidadesARegistrar.push(entidad);
    }

    const registrosCreados: NumeroEstudiantesPorSemestreEntity[] = [];

    for (let entidad of entidadesARegistrar) {
      const registroExistente = await this.numeroEstudiantesPorSemestreRepository.findOne({
        where: { asignatura: entidad.asignatura, semestre: entidad.semestre }
      });
      // Si ya existe, actualiza
      if (registroExistente) {
        if (entidad.numeroEstudiantes > 0) {
          await this.numeroEstudiantesPorSemestreRepository.update(registroExistente, {
            numeroEstudiantes: entidad.numeroEstudiantes
          });
          registrosCreados.push(entidad);
        } else {
          await this.numeroEstudiantesPorSemestreRepository.delete(registroExistente);
        }
      }
      // Si no existe, crea
      else {
        if (entidad.numeroEstudiantes > 0) {
          const creado = await this.numeroEstudiantesPorSemestreRepository.save(entidad);
          registrosCreados.push(creado);
        }
      }
    }

    return {
      mensaje: `Se ha registrado el número de estudiantes de ${registrosCreados.length} asignatura(s).`,
      registrosCreados: registrosCreados,
    }
  }

  async obtenerNumeroEstudiantesPorSemestreId(idSemestre: string) {
    const semestre = await this.semestreService.obtenerSemestrePorSuID(idSemestre);
    if (!semestre) {
      throw new HttpException('No se encontró el semestre indicado.', HttpStatus.BAD_REQUEST);
    }
    return await this.numeroEstudiantesPorSemestreRepository.find({
      where: { semestre: semestre },
      relations: ['asignatura'],
    });
  }

  async comprobarArregloDeNumeroEstudiantesPorSemestre(arreglo: any[]) {
    // Comprobar que lo recibido sea un arreglo
    if (!Array.isArray(arreglo)) {
      throw new HttpException('Los datos enviados no corresponden a un arreglo.', HttpStatus.BAD_REQUEST);
    }
    // Comprobar arreglo vacio
    if (arreglo.length == 0) {
      throw new HttpException('Los datos enviados corresponden a un arreglo vacío.', HttpStatus.BAD_REQUEST);
    }
    for (let item of arreglo) {
      if (!(typeof item === 'object' && item !== null && !Array.isArray(item))) {
        const dtoEjemplo = plainToInstance(NumeroEstudiantesPorSemestreDTO, {});
        const errores = await validate(dtoEjemplo);
        const estructura = errores.map(error => {
          return { 'propiedad': error.property, 'restricciones': error.constraints }
        });

        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            message: 'El arreglo enviado no contiene elementos con la estructura requerida. Cada elemento debe tener las siguientes propiedades con sus respectivas restricciones:',
            estructura: estructura,
          },
          HttpStatus.BAD_REQUEST
        );
      }
      const itemDTO = plainToInstance(NumeroEstudiantesPorSemestreDTO, item);
      const errores = await validate(itemDTO);
      if (errores.length > 0) {
        throw new HttpException(errores, HttpStatus.BAD_REQUEST);
      }
    }
    if (!arreglo.every(i => i.idSemestre == arreglo[0].idSemestre)) {
      throw new HttpException('El semestre indicado en el arreglo no es consistente.', HttpStatus.BAD_REQUEST);
    }
  }

}