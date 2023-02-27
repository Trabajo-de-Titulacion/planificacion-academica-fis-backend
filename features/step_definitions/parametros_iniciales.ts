import { Given, Then, When } from '@cucumber/cucumber';

import { setDefaultTimeout } from '@cucumber/cucumber';
import { JornadaLaboralService } from '../../src/parametros-iniciales/services/jornada-laboral.service';
import { SemestreEntity } from '../../src/parametros-iniciales/entities/semestre.entity';
import ESTADO_SEMESTRE from '../../src/parametros-iniciales/types/estado-semestre.type';
import { faker } from '@faker-js/faker';
import { JornadaLaboralEntity } from '../../src/parametros-iniciales/entities/jornada-laboral.entity';
import { FacultadEntity } from '../../src/parametros-iniciales/entities/facultad.entity';
import { TipoAulaEntity } from '../../src/parametros-iniciales/entities/tipo-aula.entity';
import { TipoAulaService } from '../../src/parametros-iniciales/services/tipo-aula.service';

setDefaultTimeout(60 * 2000);

// eslint-disable-next-line @typescript-eslint/no-var-requires
const assert = require('assert');

/* Escenario: Aquel en el que se establece el horario laboral de la institución*/

Given(
  'el semestre {string} con estado {string},',
  function (abreviatura: string, estado: string) {
    const semestre: SemestreEntity = {
      id: faker.datatype.uuid(),
      abreviatura,
      estado: ESTADO_SEMESTRE[estado],
    };
    this.semestre = semestre;
  },
);

When(
  'se registre el día laboral {string} en el horario de {string} a {string} horas con hora de almuerzo a las {string},',
  async function (dia, horaInicio, horaFin, horaAlmuerzo) {
    const jornada: JornadaLaboralEntity = {
      id: faker.datatype.uuid(),
      horaInicio,
      horaFin,
      horaAlmuerzo,
      dia,
      semestre: this.semestre,
    };
    this.jornada = jornada;
    this.jornadaLaboralService = await this.app.get(JornadaLaboralService);
    this.numeroHorasLaborales =
      await this.jornadaLaboralService.obtenerNumeroDeIntervalos(this.jornada);
  },
);

Then(
  'se obtienen {int} horas laborales e intervalos de una hora.',
  { timeout: 7 * 5000 },
  async function (horas) {
    assert.equal(this.numeroHorasLaborales, horas);
  },
);
/*
/* Escenario: Aquel en el que se registra los tipos de aula de la FIS */

Given(
  'que existe la unidad académica {string},',
  async function (nombre: string) {
    const facultadUno: FacultadEntity = {
      id: faker.datatype.uuid(),
      nombre,
    };
    this.facultadUno = facultadUno;
  },
);

Given(
  'otra unidad académica con nombre {string}',
  async function (nombre: string) {
    const facultadDos: FacultadEntity = {
      id: faker.datatype.uuid(),
      nombre,
      tiposAulas: [],
    };
    this.facultadDos = facultadDos;
  },
);

When(
  'se registre el tipo de aula {string} para la primera unidad,',
  async function (tipo: string) {
    const tipoAulaUno: TipoAulaEntity = {
      id: faker.datatype.uuid(),
      tipo,
      facultad: this.facultadUno,
    };
    this.tipoAulaUno = tipoAulaUno;
  },
);

When(
  'el tipo de aula {string} para la segunda unidad académica,',
  async function (tipo: string) {
    const tipoAulaDos: TipoAulaEntity = {
      id: faker.datatype.uuid(),
      tipo,
      facultad: this.facultadUno,
    };
    this.facultadDos.tiposAulas.push(tipoAulaDos);
  },
);

Then(
  'la segunda unidad acedémica dispone de {int} laboratorios.',
  async function (registros: number) {
    this.tipoAulaService = await this.app.get(TipoAulaService);
    this.laboratorios = this.tipoAulaService.obtenerCantidadLaboratorios(
      this.facultadDos,
    );
    assert.equal(this.laboratorios, registros);
  },
);
