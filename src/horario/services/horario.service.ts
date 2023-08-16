import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsuarioService } from '../../../src/usuarios/services/usuario.service';
import { Repository } from 'typeorm';
import { HorarioDto } from '../dto/horario.dto';
import { HorarioEntity } from '../entities/horario.entity';
import { XMLBuilder } from 'fast-xml-parser';
import {
  nombreFacultad,
  nombreUniversidad,
} from '../../../src/utils/constantes';
import { JornadaLaboralService } from '../../../src/parametros-iniciales/services/jornada-laboral.service';
import { SemestreService } from '../../../src/parametros-iniciales/services/semestre.service';
import { AsignaturaService } from '../../../src/asignatura/services/asignatura.service';
import { TipoAulaService } from '../../../src/parametros-iniciales/services/tipo-aula.service';
import { DocenteService } from '../../../src/docente/services/docente.service';
import { HorasNoDisponiblesService } from '../../../src/horas_no_disponibles/services/horas_no_disponibles.service';
import { ActividadesService } from '../../../src/actividades/services/actividades.service';
import { NivelService } from '../../../src/niveles/services/nivel.service';
import { FacultadService } from '../../../src/parametros-iniciales/services/facultad.service';
import { EspaciosFisicosService } from '../../../src/espacios_fisicos/services/espacios_fisicos.service';
import * as fs from 'fs';
import { exec } from 'node:child_process';
import { xml2js } from 'xml-js';

@Injectable()
export class HorarioService {
  constructor(
    @InjectRepository(HorarioEntity)
    private repositorioHorario: Repository<HorarioEntity>,
    private usuarioService: UsuarioService,
    private jornadaLaboralService: JornadaLaboralService,
    private semestreService: SemestreService,
    private asignaturasService: AsignaturaService,
    private tipoAulaService: TipoAulaService,
    private docentesService: DocenteService,
    private horasNoDisponiblesService: HorasNoDisponiblesService,
    private actividadesService: ActividadesService,
    private nivelesService: NivelService,
    private facultadesService: FacultadService,
    private espaciosFisicosService: EspaciosFisicosService,
  ) {}
  //TODO: COLOCAR LA DESCRIPCION
  async crearHorario(horario: HorarioDto) {
    const usuario = await this.usuarioService.obtenerUsuarioCompletoPorSuID(
      horario.idUsuario,
    );
    if (usuario) {
      const horarioNuevo = this.repositorioHorario.create(horario);
      horarioNuevo.usuario = usuario;
    }
  }

  /* ========================================================================================================= */
  /* ======================================= OBTENER TODOS LOS HORARIOS  ===================================== */
  /* ========================================================================================================= */

  obtenerHorarios(): Promise<HorarioEntity[]> {
    Logger.log('obtenerHorarios', 'HORARIOS');
    return this.repositorioHorario.find({
      relations: ['usuario'],
      select: ['id', 'fechaCreacion', 'descripcion', 'usuario'],
    });
  }

  /* ================================================================================================= */
  /* ======================================= OBTENER UN HORARIO  ===================================== */
  /* ================================================================================================= */

  obtenerHorarioPorID(idHorario: string): Promise<HorarioEntity> {
    Logger.log('obtenerHorarioPorId', 'HORARIO');
    return this.repositorioHorario.findOne({
      where: { id: idHorario },
      select: ['id', 'horarioJson'],
    });
  }

  /* ===================================================================================================== */
  /* ======================================= OBTENER HORARIO DOCENTE ===================================== */
  /* ===================================================================================================== */

  async obtenerHorarioDocente(nombreDocente: string, idHorario: string) {
    Logger.log('obtenerHorarioDocente');
    //Buscar horario
    const horario = await this.obtenerHorarioPorID(idHorario);

    // Arreglo de respuesta
    const horarioFiltrado = [];
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
            console.log('horas[k].Teacher', horas[k].Teacher);
            // Si el profesor se llama igual al enviado
            if (horas[k].Teacher['-name'].toUpperCase() === nombreDocente) {
              // Si se vinculó un espacio físico se añade este
              if (horas[k].Room) {
                horarioFiltrado[index] = {
                  asignatura: horas[k].Subject['-name'].toUpperCase(),
                  tipoAula: horas[k].Activity_Tag['-name'],
                  dia: dias[j]['-name'].toUpperCase(),
                  horario: horas[k]['-name'].replace(/ /g, ''),
                  aula: horas[k].Room['-name'].toUpperCase(),
                };
                index++;
              } else {
                horarioFiltrado[index] = {
                  asignatura: horas[k].Subject['-name'].toUpperCase(),
                  tipoAula: horas[k].Activity_Tag['-name'],
                  dia: dias[j]['-name'].toUpperCase(),
                  horario: horas[k]['-name'].replace(/ /g, ''),
                };
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
    Logger.log('obtenerHorarioGrupo');
    //Buscar horario
    const horario = await this.repositorioHorario.findOne({ id: idHorario });

    // Arreglo de respuesta
    const horarioFiltrado = [];
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
                  horario: horas[k]['-name'].replace(/ /g, ''),
                  aula: horas[k].Room['-name'].toUpperCase(),
                };
                index++;
              } else {
                horarioFiltrado[index] = {
                  docente: horas[k].Teacher['-name'].toUpperCase(),
                  asignatura: horas[k].Subject['-name'].toUpperCase(),
                  tipoAula: horas[k].Activity_Tag['-name'],
                  dia: dias[j]['-name'].toUpperCase(),
                  horario: horas[k]['-name'].replace(/ /g, ''),
                };
                index++;
              }
            }
          }
        }
      }
    }

    return horarioFiltrado;
  }

  async Format() {
    const obj = {};
    obj['Students_Timetable'];
  }

  async generarHorario(email: string) {
    const usuario = await this.usuarioService.obtenerUsuarioPorSuCorreo(email);
    // Jornadas
    const semestreEnCurso =
      await this.semestreService.obtenerSemestreConPlanificacionEnProgreso();

    const diasLaborables =
      await this.jornadaLaboralService.obtenerJornadaLaboralPorSemestre(
        semestreEnCurso.id,
      );

    const intervalos = await this.jornadaLaboralService.obtenerIntervalos(
      diasLaborables[0].id,
    );

    const soloHoras = intervalos.map((intervalo) => {
      return {
        Name: `${
          parseInt(intervalo[0]) < 10 ? '0' + intervalo[0] : intervalo[0]
        }-${parseInt(intervalo[1]) < 10 ? '0' + intervalo[1] : intervalo[1]}`,
      };
    });

    const soloDias = diasLaborables.map((jornada) => {
      return {
        Name: jornada.dia
          .toLowerCase()
          .replace(/^./, jornada.dia[0].toUpperCase()),
      };
    });

    // Asignaturas
    const asignaturas = await this.asignaturasService.obtenerAsignatura();
    const soloNombreCodigosAsignaturas = asignaturas.map((asignatura) => {
      return {
        Name: `${asignatura.nombre} (${asignatura.codigo})`,
        Comments: '',
      };
    });

    // Tipo Aulas
    const tipoAulas = await this.tipoAulaService.obtenerTipoAulas();

    const soloTiposAulas = tipoAulas.map((tipo) => {
      return {
        Name: `${tipo.tipo}`,
        Printable: 'true',
        Comments: `${tipo.facultad.nombre}`,
      };
    });

    // Docentes
    const docentes = await this.docentesService.obtenerDocentes();
    const informacionCompletaDocentes = [];

    for (let index = 0; index < docentes.length; index++) {
      const docente = docentes[index];
      const docentesMap = new Map();

      const asignaturasDocente =
        await this.actividadesService.obtenerAsignaturasPorDocente(docente.id);

      asignaturasDocente.map((asignatura) => {
        docentesMap.set(
          `${asignatura.nombre} (${asignatura.codigo})`,
          `${asignatura.nombre} (${asignatura.codigo})`,
        );
      });

      const infoDocente = {
        Name: docente.nombreCompleto,
        Target_Number_of_Hours: 10,
        Qualified_Subjects: {
          Qualified_Subject: Array.from(docentesMap.values()),
        },
        Comments: '',
      };
      informacionCompletaDocentes.push(infoDocente);
    }

    // Niveles y grupos - Years
    const niveles = await this.nivelesService.obtenerTodosLosNivelesYGrupos();
    const nivelesYGrupos = niveles.map((nivel) => {
      return {
        Name: nivel.nombre,
        Number_of_Students: nivel.numeroEstudiantes,
        Comments: nivel.carrera.nombre,
        Separator: ' ',
        Group: nivel.grupos.map((grupo) => {
          return {
            Name: grupo.nombre,
            Number_of_Students: grupo.numeroEstudiantes,
            Comments: '',
          };
        }),
      };
    });

    // Actividades
    const actividades = await this.actividadesService.obtenerActividades();
    const actividadesInfoCompleta = actividades.map((actividad, index) => {
      return {
        Teacher: actividad.docente.nombreCompleto,
        Subject: `${actividad.asignatura.nombre} (${actividad.asignatura.codigo})`,
        Activity_Tag: actividad.tipoAula.tipo,
        Students: actividad.grupo.nombre,
        Duration: actividad.duracion,
        Total_Duration: actividad.duracion,
        Id: index + 1,
        Activity_Group_Id: 0,
        Number_Of_Students: actividad.numeroEstudiantes,
        Active: actividad.estado,
        Comments: '',
      };
    });

    // Facultades
    const facultades = await this.facultadesService.obtenerFacultades();

    const facultadesInfo = facultades.map((facultad) => {
      return {
        Name: facultad.nombre,
        Comments: '',
      };
    });

    // Espacios
    const espaciosFisicos =
      await this.espaciosFisicosService.obtenerEspaciosFisicos();

    const espaciosInfo = espaciosFisicos.map((espacio) => {
      return {
        Name: espacio.nombre,
        Building: espacio.tipo.facultad.nombre,
        Capacity: espacio.aforo,
        Virtual: false,
        Comments: espacio.tipo.tipo,
      };
    });

    // Builders
    const builderDias = new XMLBuilder({
      arrayNodeName: 'Day',
      format: true,
    });

    const buildersHoras = new XMLBuilder({
      arrayNodeName: 'Hour',
      format: true,
    });

    const buildersAsignaturas = new XMLBuilder({
      arrayNodeName: 'Subject',
      format: true,
    });

    const builderTipoAulas = new XMLBuilder({
      arrayNodeName: 'Activity_Tag',
      format: true,
    });

    const builderInfoDocentes = new XMLBuilder({
      arrayNodeName: 'Teacher',
      format: true,
    });

    const builderInfoGruposYNiveles = new XMLBuilder({
      arrayNodeName: 'Year',
      format: true,
    });

    const builderActividades = new XMLBuilder({
      arrayNodeName: 'Activity',
      format: true,
    });

    const builderFacultades = new XMLBuilder({
      arrayNodeName: 'Building',
      format: true,
    });

    const builderEspacios = new XMLBuilder({
      arrayNodeName: 'Room',
      format: true,
    });

    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
\n<fet version="6.1.5">
\n<Institution_Name>${nombreUniversidad}</Institution_Name>
\n<Comments>${nombreFacultad}</Comments>
\n<Days_List>
<Number_of_Days>${diasLaborables.length}</Number_of_Days>
${builderDias.build(soloDias)}</Days_List>\n
<Hours_List>
<Number_of_Hours>${intervalos.length}</Number_of_Hours>
${buildersHoras.build(soloHoras)}</Hours_List>
\n<Subjects_List>
${buildersAsignaturas.build(soloNombreCodigosAsignaturas)}</Subjects_List>
\n<Activity_Tags_List>
${builderTipoAulas.build(soloTiposAulas)}</Activity_Tags_List>
\n<Teachers_List>
${builderInfoDocentes.build(informacionCompletaDocentes)}</Teachers_List>
\n<Students_List>
${builderInfoGruposYNiveles.build(nivelesYGrupos)}</Students_List>
\n<Activities_List>
${builderActividades.build(actividadesInfoCompleta)}</Activities_List>
\n<Buildings_List>
${builderFacultades.build(facultadesInfo)}</Buildings_List>
<Rooms_List>
${builderEspacios.build(espaciosInfo)}</Rooms_List>

<Time_Constraints_List>
<ConstraintBasicCompulsoryTime>
	<Weight_Percentage>100</Weight_Percentage>
	<Active>true</Active>
	<Comments></Comments>
</ConstraintBasicCompulsoryTime>
<ConstraintBreakTimes>
	<Weight_Percentage>100</Weight_Percentage>
	<Number_of_Break_Times>1</Number_of_Break_Times>
	<Break_Time>
		<Day>Jueves</Day>
		<Hour>11:00-12:00</Hour>
	</Break_Time>
	<Active>true</Active>
	<Comments></Comments>
</ConstraintBreakTimes>

<ConstraintActivityPreferredStartingTime>

</ConstraintActivityPreferredStartingTime>
</Time_Constraints_List>

<Space_Constraints_List>
<ConstraintBasicCompulsorySpace>
	<Weight_Percentage>100</Weight_Percentage>
	<Active>true</Active>
	<Comments></Comments>
</ConstraintBasicCompulsorySpace>

<ConstraintActivityPreferredRoom>

</ConstraintActivityPreferredRoom>
</Space_Constraints_List>


</fet>
`;

    fs.writeFile('./fet/output.fet', xmlContent, () => {
      Logger.log(`Archivo creado ${usuario.id}`, 'FET');

      // run the `ls` command using exec
      exec(
        'cp ./fet/output.fet $HOME/Documents/spa/output.fet',
        (err, output) => {
          // once the command has completed, the callback function is called
          if (err) {
            // log and return if we encounter an error
            console.error('could not execute command: ', err);
            return;
          }

          exec(
            'fet-cl --inputfile=output.fet',
            {
              cwd: `/home/nobh/Documents/spa`,
            },
            (err, output) => {
              // once the command has completed, the callback function is called
              if (err) {
                // log and return if we encounter an error
                console.error('could not execute command: ', err);
                return;
              }

              exec(
                'cp -r ./output $HOME/Documents/spa/planificacion-academica-fis-backend/fet',
                {
                  cwd: `/home/nobh/Documents/spa/timetables`,
                },
                (err, output) => {
                  // once the command has completed, the callback function is called
                  if (err) {
                    // log and return if we encounter an error
                    console.error('could not execute command: ', err);
                    return;
                  }

                  const data = fs.readFileSync(
                    './fet/output/output_subgroups.xml',
                    { encoding: 'utf8', flag: 'r' },
                  );

                  const jsonData = xml2js(data, {
                    compact: true,
                    nameKey: '-name',
                    alwaysArray: false,
                    ignoreDoctype: true,
                    alwaysChildren: false,
                    attributesKey: '-name',
                    attributeValueFn(
                      attributeValue,
                      attributeName,
                      parentElement,
                    ) {
                      return attributeValue;
                    },
                  });

                  ///////////////// FORMAAAAAAAT

                  const format = {};
                  let formatSubgrups = [];

                  formatSubgrups = jsonData['Students_Timetable'][
                    'Subgroup'
                  ].map((sub) => {
                    const subgroup = {
                      '-name': sub['-name'].name,
                      Day: sub['Day'].map((d) => {
                        const day = {
                          '-name': d['-name']['name'],
                          Hour: d['Hour'].map((h) => {
                            console.log('hora', h);
                            const keysHora = Object.keys(h);
                            if (!keysHora.includes('Activity')) {
                              return { '-name': h['-name']['name'] };
                            } else {
                              return {
                                '-name': h['-name']['name'],
                                Activity: {
                                  '-id': h['Activity']['-name']['id'],
                                },
                                Teacher: {
                                  '-name': h['Teacher']['-name']['name'],
                                },
                                Subject: {
                                  '-name': h['Subject']['-name']['name'],
                                },
                                Activity_Tag:
                                  h['Activity_Tag']['-name']['name'],
                                Room: {
                                  '-name': 'KAPPA-IC',
                                },
                              };
                            }
                          }),
                        };
                        return day;
                      }),
                    };
                    return subgroup;
                    //                    formatSubgrups.push
                  });

                  // Primer nodo
                  format['Students_Timetable'] = {
                    Subgroup: formatSubgrups,
                  };

                  console.log('format', format);

                  /////////////////// FORMAT

                  const jsonDataFormat = JSON.stringify(format);
                  const subs = jsonData['Students_Timetable']['Subgroup'].map(
                    (grupo) => {
                      return {
                        '-name': grupo['name'],
                        Day: grupo['Day'],
                      };
                    },
                  );

                  this.repositorioHorario.save({
                    descripcion: 'Horario por subgrupos',
                    fechaCreacion: new Date(),
                    horarioJson: jsonDataFormat,
                    usuario: usuario,
                  });
                },
              );
            },
          );
        },
      );
    });
    return {
      xmlContent,
    };
  }

  async procesarPlanificacion(contenido: string, email: string) {
    const usuario = await this.usuarioService.obtenerUsuarioPorSuCorreo(email);
    fs.writeFile('./fet/output.fet', contenido, () => {
      Logger.log(`Archivo creado ${usuario.id}`, 'FET');

      // run the `ls` command using exec
      exec(
        'cp ./fet/output.fet $HOME/Documents/spa/output.fet',
        (err, output) => {
          // once the command has completed, the callback function is called
          if (err) {
            // log and return if we encounter an error
            console.error('could not execute command: ', err);
            return;
          }

          exec(
            'fet-cl --inputfile=output.fet',
            {
              cwd: `/home/nobh/Documents/spa`,
            },
            (err, output) => {
              // once the command has completed, the callback function is called
              if (err) {
                // log and return if we encounter an error
                console.error('could not execute command: ', err);
                return;
              }

              exec(
                'cp -r ./output $HOME/Documents/spa/planificacion-academica-fis-backend/fet',
                {
                  cwd: `/home/nobh/Documents/spa/timetables`,
                },
                async (err, output) => {
                  // once the command has completed, the callback function is called
                  if (err) {
                    // log and return if we encounter an error
                    console.error('could not execute command: ', err);
                    return;
                  }

                  const data = fs.readFileSync(
                    './fet/output/output_subgroups.xml',
                    { encoding: 'utf8', flag: 'r' },
                  );

                  const jsonData = xml2js(data, {
                    compact: true,
                    nameKey: '-name',
                    alwaysArray: false,
                    ignoreDoctype: true,
                    alwaysChildren: false,
                    attributesKey: '-name',
                    attributeValueFn(
                      attributeValue,
                      attributeName,
                      parentElement,
                    ) {
                      return attributeValue;
                    },
                  });

                  ///////////////// FORMAAAAAAAT

                  const format = {};
                  let formatSubgrups = [];

                  console.log('jsonData ===> ', jsonData);

                  formatSubgrups = jsonData['Students_Timetable'][
                    'Subgroup'
                  ].map((sub) => {
                    const subgroup = {
                      '-name': sub['-name'].name,
                      Day: sub['Day'].map((d) => {
                        const day = {
                          '-name': d['-name']['name'],
                          Hour: d['Hour'].map((h) => {
                            console.log('hora  ===> ', h);
                            const keysHora = Object.keys(h);
                            if (!keysHora.includes('Activity')) {
                              return { '-name': h['-name']['name'] };
                            } else {
                              if (
                                !keysHora.includes('Teacher') &&
                                !keysHora.includes('Room')
                              ) {
                                return {
                                  '-name': h['-name']['name'],
                                  Activity: {
                                    '-id': h['Activity']['-name']['id'],
                                  },
                                  Subject: {
                                    '-name': h['Subject']['-name']['name'],
                                  },
                                  Activity_Tag:
                                    h['Activity_Tag']['-name']['name'],
                                };
                              }

                              console.log('h --->', h);
                              return {
                                '-name': h['-name']['name'],
                                Activity: {
                                  '-id': h['Activity']['-name']['id'],
                                },
                                Teacher: {
                                  '-name': h['Teacher']['-name']['name'],
                                },
                                Subject: {
                                  '-name': h['Subject']['-name']['name'],
                                },
                                Activity_Tag:
                                  h['Activity_Tag']['-name']['name'],
                                Room: {
                                  '-name': h['Room']
                                    ? h['Room']['-name']['name']
                                    : '',
                                },
                              };
                            }
                          }),
                        };
                        return day;
                      }),
                    };
                    return subgroup;
                    //                    formatSubgrups.push
                  });

                  // Primer nodo
                  format['Students_Timetable'] = {
                    Subgroup: formatSubgrups,
                  };

                  console.log('format', format);

                  /////////////////// FORMAT

                  const jsonDataFormat = JSON.stringify(format);
                  const subs = jsonData['Students_Timetable']['Subgroup'].map(
                    (grupo) => {
                      return {
                        '-name': grupo['name'],
                        Day: grupo['Day'],
                      };
                    },
                  );

                  await this.repositorioHorario.save({
                    descripcion: 'Horario por subgrupos',
                    fechaCreacion: new Date(),
                    horarioJson: jsonDataFormat,
                    usuario: usuario,
                  });
                },
              );
            },
          );
        },
      );
    });
  }

  async generarHorarioXML(contenido: string) {
    fs.writeFile('./fet/output.fet', contenido, () => {
      Logger.log(`Archivo creado`, 'FET');

      // run the `ls` command using exec
      exec(
        'cp ./fet/output.fet $HOME/Documents/spa/output.fet',
        (err, output) => {
          // once the command has completed, the callback function is called
          if (err) {
            // log and return if we encounter an error
            console.error('could not execute command: ', err);
            return;
          }

          exec(
            'fet-cl --inputfile=output.fet',
            {
              cwd: `/home/nobh/Documents/spa`,
            },
            (err, output) => {
              // once the command has completed, the callback function is called
              if (err) {
                // log and return if we encounter an error
                console.error('could not execute command: ', err);
                return;
              }

              exec(
                'cp -r ./output $HOME/Documents/spa/planificacion-academica-fis-backend/fet',
                {
                  cwd: `/home/nobh/Documents/spa/timetables`,
                },
                async (err, output) => {
                  // once the command has completed, the callback function is called
                  if (err) {
                    // log and return if we encounter an error
                    console.error('could not execute command: ', err);
                    return;
                  }

                  const data = fs.readFileSync(
                    './fet/output/output_subgroups.xml',
                    { encoding: 'utf8', flag: 'r' },
                  );

                  return data;
                },
              );
            },
          );
        },
      );
    });
  }
}
