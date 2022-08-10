import { After, Given, Then, When } from "@cucumber/cucumber";
import { getRepository } from "typeorm";
import assert from "assert";

import { SemestreDTO } from "../../src/parametros-iniciales/dtos/semestre.dto";
import { SemestreEntity } from "../../src/parametros-iniciales/entities/semestre.entity";
import { JornadaLaboralController } from "../../src/parametros-iniciales/controllers/jornada-laboral.controller";
import { JornadaLaboralDto } from "../../src/parametros-iniciales/dtos/jornada-laboral.dto";
import { JornadaLaboralEntity } from "../../src/parametros-iniciales/entities/jornada-laboral.entity";
import { FacultadDTO } from "../../src/parametros-iniciales/dtos/facultad.dto";
import { FacultadEntity } from "../../src/parametros-iniciales/entities/facultad.entity";
import { TipoAulaController } from "../../src/parametros-iniciales/controllers/tipo-aula.controller";
import { TipoAulaDto } from "../../src/parametros-iniciales/dtos/tipo-aula.dto";
var { setDefaultTimeout } = require('@cucumber/cucumber');

setDefaultTimeout(60 * 1000);

/* Escenario: Aquel en el que se establece el horario laboral de la institución*/

Given('el semestre en curso {string},', async function (abreviatura: string) {
  const semestre: SemestreDTO = { abreviatura };
  this.semestre = semestre;
  this.repository = getRepository(SemestreEntity);
  this.repository.save(this.semestre);
});

When('se registre el día laboral {string} en el horario de {string} a {string} horas con hora de almuerzo a las {string},',
  async function (diaLaboral, horaInicio, horaFin, horaAlmuerzo) {
    this.jornadaLaboralController = await this.app.get(JornadaLaboralController);
    const jornada: JornadaLaboralDto = {
      dia: diaLaboral,
      horaInicio,
      horaFin,
      horaAlmuerzo,
      idSemestre: this.semestre.id,
    }
    this.jornada = jornada;
    await this.jornadaLaboralController.crearJornadaLaboral(jornada);
  });

Then('se obtienen {int} horas laborales e intervalos de una hora.', async function (horas) {
  this.jornadaLunes = await getRepository(JornadaLaboralEntity).findOne({ dia: this.jornada.dia });
  this.intervalos = await this.jornadaLaboralController.obtenerIntervalos(this.jornadaLunes.id);
  assert.equal(this.intervalos.length, horas);
})

After("@parametros_iniciales_escenario1", async function () {
  await getRepository(JornadaLaboralEntity).delete(this.jornadaLunes);
  await getRepository(SemestreEntity).delete(this.semestre);
});

/* Aquel en el que se registra los tipos de aula de la FIS */

Given('que existe la facultad con nombre {string},', async function (nombre: string) {
  const facultad: FacultadDTO = { nombre };
  this.facultad = facultad;
  this.repository = getRepository(FacultadEntity);
  this.repository.save(this.facultad);
});

When('se registre el tipo de aula {string}', async function (tipo: string) {
  this.tipoAulaController = await this.app.get(TipoAulaController);
  const tipoAula: TipoAulaDto = {
    tipo,
    idFacultad: this.facultad.id
  }
  this.tipoAula = tipoAula;
  this.tipoAulaController.crearTipoAula(this.tipoAula);
});

Then('al consultar la base de datos se observan {int} registros.', async function (registros: number) {
  this.registrosAlmacenados = await this.tipoAulaController.obtenerTipoAulas();
  assert.equal(this.registrosAlmacenados.length, registros);
});