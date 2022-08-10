import { HorasNoDisponiblesDTO } from "../../src/horas_no_disponibles/dto";
import { HorasNoDisponiblesController } from "../../src/horas_no_disponibles/controllers/horas_no_disponibles.controller";
import { HoraNoDisponibleEntity } from "../../src/horas_no_disponibles/entities/hora_no_disponible.entity";
import { getRepository } from "typeorm";

import { Given, When, Then, After } from '@cucumber/cucumber';
const assert = require('assert');


/* Se agregan horas no disponibles de un docente */

Given('que existe un docente con id 5a5z4a6s5', async function () {
    this.docente_id = "5a5z4a6s5";
});


When('se agregan como horas no disponibles el día Martes de {int} a {int}', async function (hora_inicio: number, hora_fin: number) {
    this.horasNoDisponiblesController = await this.app.get(HorasNoDisponiblesController);

    this.horas_no_disponibles1 = new HorasNoDisponiblesDTO(this.docente_id, "Martes", hora_inicio);

    this.respuesta1 = await this.horasNoDisponiblesController.crearHoraNoDisponible(this.horas_no_disponibles1);
});

When('el día Martes de {int} a {int}', async function (hora_inicio: number, hora_fin: number) {
    this.horas_no_disponibles2 = new HorasNoDisponiblesDTO(this.docente_id, "Martes", hora_inicio);

    this.respuesta2 = await this.horasNoDisponiblesController.crearHoraNoDisponible(this.horas_no_disponibles2);
});

When('también el día Jueves de {int} a {int}', async function (hora_inicio: number, hora_fin: number) {
    this.horas_no_disponibles3 = new HorasNoDisponiblesDTO(this.docente_id, "Jueves", hora_inicio);

    this.respuesta3 = await this.horasNoDisponiblesController.crearHoraNoDisponible(this.horas_no_disponibles3);
});


Then('se obtienen {int} filas alteradas en la base de datos', async function (filas_alteradas: number) {
    this.filas_alteradas = this.respuesta1.filas_alteradas + this.respuesta2.filas_alteradas + this.respuesta3.filas_alteradas;

    assert.equal(this.filas_alteradas, filas_alteradas);
});


// Borrar datos de la prueba
After("@horas_no_disponibles_prueba1", async function () {
    this.repository = await getRepository(HoraNoDisponibleEntity);
    // Borrar registros creados en cada Cuando
    this.repository.delete(this.horas_no_disponibles1);
    this.repository.delete(this.horas_no_disponibles2);
    this.repository.delete(this.horas_no_disponibles3);
});