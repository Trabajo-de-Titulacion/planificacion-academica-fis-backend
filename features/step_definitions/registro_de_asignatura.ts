const assert = require('assert');
import { Given, When, Then } from '@cucumber/cucumber';
import { getRepository } from 'typeorm';
import { AsignaturaEntity } from '../../src/asignatura/entities/asignatura.entity'
import * as fs from 'fs';
import { AsignaturaController } from '../../src/asignatura/controllers/asignatura.controller';

/* ESCENARIO 1 - Ingreso individual de una asignatura */

Given('que se tiene una asignatura con código {string}, nombre {string}, cantidad de créditos {string}, código de requisito {string} y código de correquisito {string}', async function (codigo_asignatura_existente, nombre_asignatura_existente, creditos_asignatura_existente, codigos_requisito_asignatura_existente, codigos_correquisito_asignatura_existente) {
    /*
    Los datos recibidos son:
    |            Significado           | Nombre variable                           | Tipo de dato necesario |
    |Código de la asignatura existente | codigo_asignatura_existente               | string                 |
    |Nombre de la asigantura existente | nombre_asignatura_existente               | string                 |
    |Cantidad de créditos              | creditos_asignatura_existente             | number                 |
    |Códigos de requisitos             | codigos_requisito_asignatura_existente    | string                 |
    |Códigos de correquisitos          | codigos_correquisito_asignatura_existente | string                 |
     */

    // Convertir a tipos de datos correspondientes

    creditos_asignatura_existente = Number(creditos_asignatura_existente);

    // Ingresar asignatura existente

    await getRepository(AsignaturaEntity).save({
        codigo: codigo_asignatura_existente,
        nombre: nombre_asignatura_existente,
        creditos: creditos_asignatura_existente,
        codigoRequisito: codigos_requisito_asignatura_existente,
        codigoCorrequisito: codigos_correquisito_asignatura_existente
    })
});

When('se ingrese el asignatura con código {string}, nombre {string}, cantidad de créditos {string}, código de requisito {string} y código de correquisito {string},', async function (codigo_asignatura_nueva, nombre_asignatura_nueva, creditos_asignatura_nueva, codigos_requisito_asignatura_nueva, codigos_correquisito_asignatura_nueva) {
    /*
    Los datos recibidos son:
    |            Significado           | Nombre variable                       | Tipo de dato necesario |
    |Código de la asignatura nueva     | codigo_asignatura_nueva               | string                 |
    |Nombre de la asigantura nueva     | nombre_asignatura_nueva               | string                 |
    |Cantidad de créditos              | creditos_asignatura_nueva             | number                 |
    |Códigos de requisitos             | codigos_requisito_asignatura_nueva    | string                 |
    |Códigos de correquisitos          | codigos_correquisito_asignatura_nueva | string                 |
     */

    // Convertir a tipos de datos correspondientes

    creditos_asignatura_nueva = Number(creditos_asignatura_nueva);

    //Ingresar nueva asignatura

    this.asignaturaController = await this.app.get(AsignaturaController);

    this.resultado_ingresar_asignatura = await this.asignaturaController.createAsignatura({
        codigo: codigo_asignatura_nueva,
        nombre: nombre_asignatura_nueva,
        creditos: creditos_asignatura_nueva,
        codigoRequisito: codigos_requisito_asignatura_nueva,
        codigoCorrequisito: codigos_correquisito_asignatura_nueva
    })

});

Then('se obtendrá la respuesta {string} del sistema', async function (respuesta_ingreso_asignatura) {
    /*
    Los datos recibidos son: 
    |          Significado              | Nombre variable                 | Tipo de dato necesario |
    |Cantidad de asignaturas ingresados | respuesta_ingreso_asignatura    | string                 |
     */

    // Realizar comprobación

    assert.equal(this.resultado_ingresar_asignatura.mensaje, respuesta_ingreso_asignatura);
});

/* ESCENARIO 2 - Ingreso por archivo de asignaturas */

When('se ingrese varios asignaturas por medio de un archivo {string}', async function (path_archivo) {
    /*
    Los datos recibidos son:
    |       Significado       | Nombre variable  | Tipo de dato necesario |
    |  Dirección del archivo  | path_archivo     | string                 |
     */

    // Ingresar varios docentes por medio del archivo

    this.asignaturaController = await this.app.get(AsignaturaController);

    this.lecturaArchivo = fs.readFileSync(path_archivo);

    this.resultado_ingresar_varios_docentes = await this.asignaturaController.createVariasAsignaturas({ buffer: this.lecturaArchivo });
});

Then('se obtendrá la respuesta {string}', function (respuesta_de_multiples_ingresos_asignaturas) {
    /*
    Los datos recibidos son: 
    |          Significado               | Nombre variable                            | Tipo de dato necesario |
    |Respuesta de asignaturas ingresados | respuesta_de_multiples_ingresos_asignaturas| string                 |
     */

    // Realizar comprobación

    assert.equal(this.resultado_ingresar_asignatura.mensaje, respuesta_de_multiples_ingresos_asignaturas);
});
