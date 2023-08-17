import { BadGatewayException, BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AsignaturaEntity } from '../../asignatura/entities/asignatura.entity';
import { AsignaturaService } from '../../../src/asignatura/services/asignatura.service';
import { DocenteEntity } from '../../../src/docente/entities/docente.entity';
import { DocenteService } from '../../../src/docente/services/docente.service';
import { GrupoEntity } from '../../../src/niveles/entities/grupo.entity';
import { GrupoService } from '../../../src/niveles/services/grupo.service';
import { NumeroEstudiantesPorSemestreService } from '../../../src/numero_estudiantes/services/numeroEstudiantesPorSemestre.service';
import { TipoAulaEntity } from '../../../src/parametros-iniciales/entities/tipo-aula.entity';
import { TipoAulaService } from '../../../src/parametros-iniciales/services/tipo-aula.service';
import { Repository } from 'typeorm';
import { CrearActividadDto } from '../dtos/crear-actividad.dto';
import { ActividadEntity } from '../entities/actividad.entity';
import { EspaciosFisicosService } from 'src/espacios_fisicos/services/espacios_fisicos.service';
import { CrearRestriccionDto } from '../dtos/crear-restriccion.dto';
import { RestriccionActividadEntity } from '../entities/restriccion-actividad.entity';

@Injectable()
export class ActividadesService {
  private readonly limiteActividadDuracion = 9;

  constructor(
    @InjectRepository(ActividadEntity)
    private actividadRespository: Repository<ActividadEntity>,
    private asignaturaService: AsignaturaService,
    private docenteService: DocenteService,
    private grupoService: GrupoService,
    private tipoAulaService: TipoAulaService,
    private numeroEstudiantesService: NumeroEstudiantesPorSemestreService,
    private espacioFisicoService: EspaciosFisicosService,
    @InjectRepository(RestriccionActividadEntity)
    private restriccionActividadRespository: Repository<RestriccionActividadEntity>,
  ) {}

  validarDuracionActividad(actividad: ActividadEntity) {
    if (actividad.duracion <= this.limiteActividadDuracion) {
      return {
        actividad,
        mensaje: 'La actividad ha sido creada exitosamente',
      };
    } else {
      return {
        actividad: null,
        mensaje:
          'Las duración semanal de la actividad no debe ser mayor a 9 horas',
      };
    }
  }

  async crearActividad(actividad: CrearActividadDto): Promise<ActividadEntity> {
    const { idAsignatura, idDocente, idGrupo, idTipoAula, duracion } =
      actividad;
    const existeActividad = await this.actividadRespository.findOne({
      where: {
        asignatura: { id: idAsignatura },
        docente: { id: idDocente },
        grupo: { id: idGrupo },
        tipoAula: { id: idTipoAula },
      },
    });

    if (existeActividad) {
      Logger.error(
        'La actividad ya se encuentra registrada',
        'ACTIVIDAD YA REGISTRADA',
      );
      throw new BadRequestException({
        code: 'ACTIVIDAD_YA_REGISTRADA',
        message: 'La actividad ya se encuentra registrada.',
      });
    }

    const numeroEstudiantes =
      await this.numeroEstudiantesService.obtenerAsignaturaPorIdDeNumeroEstudiantes(
        idAsignatura,
      );

    const docente = await this.docenteService.obtenerDocentePorID(idDocente);
    const grupo = await this.grupoService.obtenerGrupoPorID(idGrupo);
    const tipoAula = await this.tipoAulaService.obtenerTipoAulaPorId(
      idTipoAula,
    );

    const newActivity = await this.actividadRespository.create({
      duracion: actividad.duracion,
    });

    newActivity.docente = docente as DocenteEntity;
    newActivity.asignatura = numeroEstudiantes.asignatura;
    newActivity.grupo = grupo as GrupoEntity;
    newActivity.tipoAula = tipoAula as TipoAulaEntity;
    newActivity.numeroEstudiantes = numeroEstudiantes.numeroEstudiantes;

    const nuevaActividad = await this.actividadRespository.save(newActivity);
    Logger.log('Se ha registrado correctamente una actividad');
    return nuevaActividad;
  }

  async obtenerActividades() {
    Logger.log('Se han listado las actividades', 'ACTIVIDADES');
    return await this.actividadRespository.find({
      relations: ['asignatura', 'docente', 'grupo', 'tipoAula'],
    });
  }

  async obtenerAsignaturasPorDocente(
    idDocente: string,
  ): Promise<AsignaturaEntity[]> {
    const actividadesDocente = await this.actividadRespository.find({
      where: {
        docente: {
          id: idDocente,
        },
      },
      relations: ['docente', 'asignatura'],
    });
    if (actividadesDocente) {
      return actividadesDocente.map((actividad) => actividad.asignatura);
    } else {
      return [];
    }
  }

  async obtenerActividadPorId(idActividad:number): Promise<ActividadEntity>{
    const actividad = await this.actividadRespository.findOne({
      where:{
        id: idActividad,
      },
      relations: ['docente','tipoAula','asignatura','grupo']
    });
    if(actividad){
      return actividad;
    }else{
      throw new Error("No existe la actividad");
    }
  }

  async crearRestriccion(restriccion:CrearRestriccionDto){
    const espacioFisico= await this.espacioFisicoService.obtenerEspacioFisicoPorId(restriccion.idEspacioFisico)
    const actividad = await this.actividadRespository.findOne({
      where:{
        id: restriccion.idActividad
      }
    });
    const exiteRestriccion = await this.restriccionActividadRespository.findOne({
      where:{
        hora: restriccion.hora,
        dia: restriccion.dia,
        espacioFisico: espacioFisico 
      },
      relations:['actividad','actividad.docente']
    })

    if(exiteRestriccion){
      throw new BadGatewayException({
        message: 'Ya existe dicha restricción',
        data: {restriccion:exiteRestriccion}
      })
    }

    await this.restriccionActividadRespository.save({
      hora: restriccion.hora,
      dia: restriccion.dia,
      actividad: actividad,
      espacioFisico: espacioFisico 
    });
  }

  async obtenerRestriccionesPorId(idActividad:number){
    const restricciones = await this.restriccionActividadRespository.find({
      where:{
        actividad:{
          id: idActividad,
        }
      },
      relations:['espacioFisico']
    })
    if(restricciones.length){
      const restriccionesFiltro = restricciones.map((param)=>{
        return {
          idRestriccion:param.id,
          idEspacioFisico: param.espacioFisico.id,
          espacioFisico:param.espacioFisico.nombre,
          dia: param.dia,
          hora: param.hora,
        }
      })
      return restriccionesFiltro;
    }else{
      return restricciones
    }
  }

  async eliminarRestriccionPorId(idRestriccion: number){
    const restriccion = await this.restriccionActividadRespository.findOne({
      where:{
        id: idRestriccion,
      }
    })
    if(restriccion){
      await this.restriccionActividadRespository.delete(idRestriccion);
      //console.log("Restriccion eliminada")
      return restriccion;
    }else{
      throw new Error("No existe la restriccion");
    }
  }

  async obtenerConstraintActivityPreferredStartingTime(){
    const restricciones = await this.restriccionActividadRespository.find({
      relations: ['actividad','espacioFisico'],
    })
    let restriccionesFiltro = restricciones.map((restriccion)=>{
      return {
        Weight_Percentage:100,
        Activity_Id: restriccion.actividad.id,
        Preferred_Day: restriccion.dia.charAt(0).toUpperCase() + restriccion.dia.slice(1,).toLowerCase(),
        Preferred_Hour: restriccion.hora,
        Permanently_Locked: true,
        Active: true,
        Comments: " ",
      }
    })

    return restriccionesFiltro;
  }

}
