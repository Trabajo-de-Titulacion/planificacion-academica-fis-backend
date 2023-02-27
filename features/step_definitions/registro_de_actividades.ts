import {
  After,
  Given,
  setDefaultTimeout,
  Then,
  When,
} from '@cucumber/cucumber';
import { faker } from '@faker-js/faker';
import { FacultadEntity } from '../../src/parametros-iniciales/entities/facultad.entity';
import { TipoAulaEntity } from '../../src/parametros-iniciales/entities/tipo-aula.entity';
import { AsignaturaEntity } from '../../src/asignatura/entities/asignatura.entity';
import { CarreraEntity } from '../../src/carrera/entities/carrera.entity';
import { DocenteEntity } from '../../src/docente/entities/docente.entity';
import { GrupoEntity } from '../../src/niveles/entities/grupo.entity';
import { NivelEntity } from '../../src/niveles/entities/nivel.entity';
import { ActividadesService } from '../../src/actividades/services/actividades.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const assert = require('assert');

setDefaultTimeout(60 * 2000);

Given(
  'que existe un docente con correo {string},',
  async function (correoElectronico: string) {
    const docente: DocenteEntity = {
      id: faker.datatype.uuid(),
      nombreCompleto: `${faker.name.firstName()}${faker.name.lastName()}`,
      correoElectronico,
      actividades: [],
    };
    this.docente = docente;
  },
);

Given(
  'la carrera {string} con código {string} con modalidad {string},',
  async function (nombre: string, codigo: string, modalidad: string) {
    const carrera: CarreraEntity = {
      id: faker.datatype.uuid(),
      nombre,
      codigo,
      duracion: faker.datatype.number({ min: 9, max: 10 }),
      modalidad,
      niveles: [],
    };
    this.carrera = carrera;
  },
);

Given(
  'la asignatura {string} con código {string} de {string} créditos,',
  async function (nombre: string, codigo: string, creditos: number) {
    const asignatura: AsignaturaEntity = {
      id: faker.datatype.uuid(),
      codigo,
      creditos,
      nombre,
    };
    this.asignatura = asignatura;
  },
);

Given(
  'un grupo con código {string} del nivel {string} de la carrera previamente mencionada,',
  async function (nombreNivel: string, nombreGrupo: string) {
    const nivel: NivelEntity = {
      id: faker.datatype.uuid(),
      nombre: nombreNivel,
      carrera: this.carrera,
      numeroEstudiantes: faker.datatype.number(),
      grupos: [],
    };

    const grupo: GrupoEntity = {
      id: faker.datatype.uuid(),
      nombre: nombreGrupo,
      nivel,
      numeroEstudiantes: faker.datatype.number(),
      actividades: [],
    };
    this.grupo = grupo;
  },
);

Given(
  'un tipo de aula con nombre {string} en la facultad con nombre {string},',
  function (nombreTipo: string, nombreFacultad: string) {
    const facultad: FacultadEntity = {
      id: faker.datatype.uuid(),
      nombre: nombreFacultad,
    };

    const tipoAula: TipoAulaEntity = {
      id: faker.datatype.uuid(),
      facultad,
      tipo: nombreTipo,
    };

    this.tipoAula = tipoAula;
  },
);

When(
  'se intenta registrar una actividad indicando un número de estudiantes de {string} y una duración semanal de {string} horas,',
  async function (numeroEstudiantes: number, duracion: number) {
    const actividadACrear = {
      id: faker.datatype.number(),
      numeroEstudiantes: numeroEstudiantes as number,
      duracion: duracion as number,
      asignatura: this.asignatura,
      docente: this.docente,
      grupo: this.grupo,
      tipoAula: this.tipoAula,
      estado: true,
    };

    this.actividadACrear = actividadACrear;
  },
);

When('se valida la duración de dicha actividad,', async function () {
  const actividadesService = await this.app.get(ActividadesService);
  this.mensaje = actividadesService.validarDuracionActividad(
    this.actividadACrear,
  ).mensaje;
});

Then('se obtiene el mensaje {string}.', function (mensaje: string) {
  assert.equal(this.mensaje, mensaje);
});
