const assert = require('assert');
import { Given, When, Then, After } from '@cucumber/cucumber';
import { getRepository } from 'typeorm';
import { AsignaturaEntity } from '../../src/asignatura/entities/asignatura.entity'
import * as fs from 'fs';
import { AsignaturaController } from '../../src/asignatura/controllers/asignatura.controller';

const path = require('path');

/* ESCENARIO 1 - Ingreso individual de una asignatura */

Given('que se tiene una asignatura con el código {string}, nombre {string} y cantidad de créditos {string}', { timeout: 5 * 5000 }, async function (codigoAsignaturaExistente, nombreAsignaturaExistente, creditosAsignaturaExistente) {
    /*
    Los datos recibidos son:
    |            Significado           |         Nombre variable                 | Tipo de dato necesario |
    |Código de la asignatura existente | codigoAsignaturaExistente               | string                 |
    |Nombre de la asigantura existente | nombreAsignaturaExistente               | string                 |
    |Cantidad de créditos              | creditosAsignaturaExistente             | number                 |
     */

    // Ingresar asignatura existente

    this.asignaturaExistente = {
        codigo: codigoAsignaturaExistente,
        nombre: nombreAsignaturaExistente,
        creditos: Number(creditosAsignaturaExistente)
    }

    await getRepository(AsignaturaEntity).save(this.asignaturaExistente)
});

When('se ingrese el asignatura con código {string}, nombre {string} y cantidad de créditos {string}', { timeout: 5 * 5000 }, async function (codigoAsignaturaNueva, nombreAsignaturaNueva, creditosAsignaturaNueva) {
    /*
    Los datos recibidos son:
    |            Significado           | Nombre variable                     | Tipo de dato necesario |
    |Código de la asignatura nueva     | codigoAsignaturaNueva               | string                 |
    |Nombre de la asigantura nueva     | nombreAsignaturaNueva               | string                 |
    |Cantidad de créditos              | creditosAsignaturaNueva             | number                 |
     */

    //Ingresar nueva asignatura

    this.asignaturaController = await this.app.get(AsignaturaController);

    this.asignaturaACrear = {
        codigo: codigoAsignaturaNueva,
        nombre: nombreAsignaturaNueva,
        creditos: Number(creditosAsignaturaNueva)
    }

    this.resultadoIngresarAsignatura = await this.asignaturaController.crearUnaAsignatura(this.asignaturaACrear);

});

Then('se obtendrá una respuesta del registro individual {string}.', { timeout: 5 * 5000 }, async function (respuestaIngresoAsignaturaIndividual) {
    /*
    Los datos recibidos son: 
    |          Significado              | Nombre variable                            | Tipo de dato necesario |
    |Cantidad de asignaturas ingresados | respuestaIngresoAsignaturaIndividual    | string                 |
     */

    // Realizar comprobación

    assert.equal(this.resultadoIngresarAsignatura.mensaje, respuestaIngresoAsignaturaIndividual);
});

After("@RegistroDeAsignatura", async function () {

    //Eliminar asignaturas
    await getRepository(AsignaturaEntity).delete(this.asignaturaExistente);
    await getRepository(AsignaturaEntity).delete(this.asignaturaACrear);

});

/* ESCENARIO 2 - Ingreso por archivo de asignaturas */

When('se ingrese varias asignaturas por medio de un archivo csv {string}', { timeout: 5 * 5000 }, async function (nombreArchivo) {
    /*
    Los datos recibidos son:
    |       Significado       | Nombre variable   | Tipo de dato necesario |
    |  Nombre del archivo     | nombreArchivo     | string                 |
     */

    // Ingresar varios docentes por medio del archivo

    this.asignaturaController = await this.app.get(AsignaturaController);
    const pathArchivo = path.join(__dirname, "..", "documents_test", nombreArchivo);
    this.lecturaArchivo = fs.readFileSync(pathArchivo);
    this.resultadoIngresarVariasAsignatura = await this.asignaturaController.crearVariasAsignaturas({ buffer: this.lecturaArchivo });
});

Then('se obtendrá una respuesta del registro múltiple {string}.', { timeout: 5 * 5000 }, function (respuestaDeMultiplesIngresosAsignaturas) {
    /*
    Los datos recibidos son: 
    |          Significado               | Nombre variable                            | Tipo de dato necesario |
    |Respuesta de asignaturas ingresados | respuestaDeMultiplesIngresosAsignaturas| string                 |
     */

    // Realizar comprobación
    assert.equal(this.resultadoIngresarVariasAsignatura.mensaje, respuestaDeMultiplesIngresosAsignaturas);
});

After("@RegistroDeVariasAsignaturas", async function () {
    //Eliminar asignaturas usadas y creadas

    await getRepository(AsignaturaEntity).delete(this.asignaturaExistente);

    for (let i = 0; i < this.resultadoIngresarVariasAsignatura.asignaturasIngresadas.length; i++) {
        await getRepository(AsignaturaEntity).delete(this.resultadoIngresarVariasAsignatura.asignaturasIngresadas[i]);
    }
});