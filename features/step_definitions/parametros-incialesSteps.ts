import { After, Given, Then, When } from "@cucumber/cucumber";
import { HorarioController } from "../../src/parametros-iniciales/controllers/horario/horario.controller";
import { HorarioDTO } from "../../src/parametros-iniciales/dtos/horario.dto";
import { SemestreDTO } from "../../src/parametros-iniciales/dtos/semestre.dto";
import { SemestreEntity } from "../../src/parametros-iniciales/entities/semestre.entity";
import { getRepository } from "typeorm";
import assert from "assert";
var { setDefaultTimeout } = require('@cucumber/cucumber');
setDefaultTimeout(60 * 1000);

Given("el semestre en curso 2022-A", async function (semestre: SemestreDTO) {
  this.semestre = { abreviatura: "2022-A" };
  await getRepository(SemestreEntity).save(this.semestre);
});



/*
When("se registre el horario laboral del día {dia_laboral} de {hora_inicio} a {hora_fin}", async function(dia_laboral, hora_inicio, hora_fin){
    this.horarioController = await this.app.get(HorarioController);
    this.horario = new HorarioDTO(dia_laboral, hora_inicio, hora_fin);
    this.respuesta = await this.horarioController.registrarHorario(this.horario);
});

Then(/^se obtienen un número de (.*) horas en dicho día laboral$/, async function(numero_horas_laborales: number){
  this.horarioController = await this.app.get(HorarioController);
  assert.equal(this.horarioController.calcularHorasLaborablesDeUnDia('LUNES'), 15);
});
*/