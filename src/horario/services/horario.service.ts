import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UsuarioService } from "../../../src/usuarios/services/usuario.service";
import { Repository } from "typeorm";
import { HorarioDto } from "../dto/horario.dto";
import { HorarioEntity } from "../entities/horario.entity";

@Injectable()
export class HorarioService {

    constructor(
        @InjectRepository(HorarioEntity) private repositorioHorario: Repository<HorarioEntity>,
        private usuarioService: UsuarioService,
    ) { }
    //TODO: COLOCAR LA DESCRIPCION
    async crearHorario(horario: HorarioDto) {
        const usuario = await this.usuarioService.obtenerUsuarioCompletoPorSuID(horario.idUsuario);
        if (usuario) {
            const horarioNuevo = this.repositorioHorario.create(horario);
            horarioNuevo.usuario = usuario;
        }
    }

    /* ========================================================================================================= */
    /* ======================================= OBTENER TODOS LOS HORARIOS  ===================================== */
    /* ========================================================================================================= */

    obtenerHorarios(): Promise<HorarioEntity[]> {
        return this.repositorioHorario.find({
            relations: ['usuario'],
            select: ['id', 'fechaCreacion', 'descripcion', 'usuario']
        });
    }

    /* ================================================================================================= */
    /* ======================================= OBTENER UN HORARIO  ===================================== */
    /* ================================================================================================= */

    obtenerHorarioPorID(idHorario: string): Promise<HorarioEntity> {
        return this.repositorioHorario.findOne({
            where: { id: idHorario },
            select: ['id', 'horarioJson']
        });
    }

    /* ===================================================================================================== */
    /* ======================================= OBTENER HORARIO DOCENTE ===================================== */
    /* ===================================================================================================== */

    async obtenerHorarioDocente(nombreDocente: string, idHorario: string) {

        //Buscar horario
        const horario = await this.repositorioHorario.findOne({ id: idHorario });

        // Arreglo de respuesta
        let horarioFiltrado = [];
        let index = 0;

        // Transformador de texto a JSON
        const arreglo = JSON.parse(horario.horarioJson.toString());
        const subgrupos = arreglo.Students_Timetable.Subgroup;

        // Revisión por cada grupo
        for (let i = 0; i < subgrupos.length; i++) {
            const dias = subgrupos[i].Day;
            // Revisión por cada día
            for (let j = 0; j < dias.length; j++) {
                const horas = dias[j].Hour;
                // Revisión por cada hora
                for (let k = 0; k < horas.length; k++) {
                    // Comprueba que exista horario en la hora iterada
                    if (horas[k].Teacher) {
                        // Si el profesor se llama igual al enviado
                        if (horas[k].Teacher['-name'].toUpperCase() == nombreDocente) {
                            // Si se vinculó un espacio físico se añade este
                            if (horas[k].Room) {
                                horarioFiltrado[index] = {
                                    asignatura: horas[k].Subject['-name'].toUpperCase(),
                                    tipoAula: horas[k].Activity_Tag['-name'],
                                    dia: dias[j]['-name'].toUpperCase(),
                                    horario: horas[k]["-name"].replace(/ /g, ""),
                                    aula: horas[k].Room["-name"].toUpperCase()
                                }
                                index++;
                            } else {
                                horarioFiltrado[index] = {
                                    asignatura: horas[k].Subject['-name'].toUpperCase(),
                                    tipoAula: horas[k].Activity_Tag['-name'],
                                    dia: dias[j]['-name'].toUpperCase(),
                                    horario: horas[k]["-name"].replace(/ /g, "")
                                }
                                index++;
                            }
                        }
                    }
                }
            }
        }

        return horarioFiltrado;
    }

    /* ===================================================================================================== */
    /* ======================================= OBTENER HORARIO GRUPO ======================================= */
    /* ===================================================================================================== */

    async obtenerHorarioGrupo(grupo: string, idHorario: string) {

        //Buscar horario
        const horario = await this.repositorioHorario.findOne({ id: idHorario });

        // Arreglo de respuesta
        let horarioFiltrado = [];
        let index = 0;

        // Transformador de texto a JSON
        const arreglo = JSON.parse(horario.horarioJson.toString());
        const subgrupos = arreglo.Students_Timetable.Subgroup;

        // Revisión por cada grupo
        for (let i = 0; i < subgrupos.length; i++) {
            if (subgrupos[i]['-name'].split(' ', 1) == grupo) {
                const dias = subgrupos[i].Day;
                // Revisión por cada día
                for (let j = 0; j < dias.length; j++) {
                    // Revisión por cada hora
                    const horas = dias[j].Hour;
                    for (let k = 0; k < horas.length; k++) {
                        // Comprueba que exista horario en la hora iterada
                        if (horas[k].Teacher) {
                            // Si se vinculó un espacio físico se añade este
                            if (horas[k].Room) {
                                horarioFiltrado[index] = {
                                    docente: horas[k].Teacher['-name'].toUpperCase(),
                                    asignatura: horas[k].Subject['-name'].toUpperCase(),
                                    tipoAula: horas[k].Activity_Tag['-name'],
                                    dia: dias[j]['-name'].toUpperCase(),
                                    horario: horas[k]["-name"].replace(/ /g, ""),
                                    aula: horas[k].Room["-name"].toUpperCase()
                                }
                                index++;
                            } else {
                                horarioFiltrado[index] = {
                                    docente: horas[k].Teacher['-name'].toUpperCase(),
                                    asignatura: horas[k].Subject['-name'].toUpperCase(),
                                    tipoAula: horas[k].Activity_Tag['-name'],
                                    dia: dias[j]['-name'].toUpperCase(),
                                    horario: horas[k]["-name"].replace(/ /g, "")
                                }
                                index++;
                            }
                        }

                    }
                }
            }
        }

        return horarioFiltrado;
    }
}