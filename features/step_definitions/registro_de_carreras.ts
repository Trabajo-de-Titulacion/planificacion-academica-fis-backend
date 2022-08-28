const assert = require('assert');
import { Given, When, Then, After } from '@cucumber/cucumber';
import { CarreraController } from '../../src/carrera/controllers/carrera.controller';
import { CarreraEntity } from '../../src/carrera/entities/carrera.entity';
import { getRepository } from 'typeorm';


/* ESCENARIO 1 - Ingreso individual de un carrera */

Given('que se tiene una carrera con código {string}, nombre {string}, duración {string} y modalidad {string}', { timeout: 5 * 5000 }, async function (codigoCarreraExistente, nombreCarreraExistente, duracionCarreraExistente, modalidadCarreraExistente) {
    /*
    Los datos recibidos son:
    |   Significado                     | Nombre variable           | Tipo de dato necesario |
    |Código de la carrera               | codigoCarreraExistente    | string                 |
    |Nombre de la carrera               | nombreCarreraExistente    | string                 |
    |Duración de la carrera (semestres) | duracionCarreraExistente  | number                 |
    |Modalidad de la carrrera           | modalidadCarreraExistente | string                 |
    */

    // Declarar e ingresar la carrera previa para comprobación

    this.carreraExistente = {
        codigo: codigoCarreraExistente,
        nombre: nombreCarreraExistente,
        duracion: Number(duracionCarreraExistente),
        modalidad: modalidadCarreraExistente
    }
    await getRepository(CarreraEntity).save(this.carreraExistente);
});

When('se ingrese una carrera con código {string}, nombre {string}, duración {string} y modalidad {string}', { timeout: 5 * 5000 }, async function (codigoCarreraNueva, nombreCarreraNueva, duracionCarreraNueva, modalidadCarreraNueva) {
    /*
    Los datos recibidos son:
    |   Significado                     | Nombre variable       | Tipo de dato necesario |
    |Código de la carrera               | codigoCarreraNueva    | string                 |
    |Nombre de la carrera               | nombreCarreraNueva    | string                 |
    |Duración de la carrera (semestres) | duracionCarreraNueva  | number                 |
    |Modalidad de la carrrera           | modalidadCarreraNueva | string                 |
    */

    // Ingresar carrera nueva

    this.carreraController = await this.app.get(CarreraController);

    this.carreraNueva = {
        codigo: codigoCarreraNueva,
        nombre: nombreCarreraNueva,
        duracion: Number(duracionCarreraNueva),
        modalidad: modalidadCarreraNueva
    }

    this.resultadoIngresarCarrera = await this.carreraController.crearUnaCarrera(this.carreraNueva);

});

Then('se obtendrá la respuesta {string}.', { timeout: 5 * 5000 }, async function (respuestaIngresoCarrera) {
    /*
    Los datos recibidos son: 
    |           Significado           | Nombre variable            | Tipo de dato necesario |
    | Cantidad de carreras ingresadas | cantidadCarrerasIngresados | string                 |
     */

    // Realizar comprobación

    assert.equal(this.resultadoIngresarCarrera.mensaje, respuestaIngresoCarrera);
});

After("@RegistroDeCarrera", async function () {

    // Eliminar carreras usadas
    await getRepository(CarreraEntity).delete(this.carreraExistente);
    await getRepository(CarreraEntity).delete(this.carreraNueva);
});