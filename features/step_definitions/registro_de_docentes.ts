const assert = require('assert');
import { Given, When, Then } from '@cucumber/cucumber';
import { DocenteController } from '../../src/docentes/docente.controller';
import { Docente } from '../../src/docentes/entities/docente.entity';
import { getRepository } from 'typeorm';
import * as fs from 'fs';

/* ESCENARIO 1 - Ingreso individual de un docente */

Given('que se tiene un docente llamado {string} con el correo electrónico {string}', async function (nombre_docente, correo_electronico) {
    /*
    Los datos recibidos son:
    |          Significado        | Nombre variable    | Tipo de dato necesario |
    |Nombre del docente existente | nombre_docente     | string                 |
    |Correo electrónico existente | correo_electronico | string                 |
    */

    // Declarar e ingresar docente previo para comprobación

    await getRepository(Docente).save({
        nombreCompleto: nombre_docente,
        correoElectronico: correo_electronico,
        codigoIngreso: "XPMagNhxU8SDYsGIY0Es"
    });

});

When('se ingrese el docente llamado {string} con el correo electrónico {string},', async function (nombre_docente_nuevo, correo_electronico_nuevo) {
    /*
    Los datos recibidos son:
    |          Significado         | Nombre variable          | Tipo de dato necesario |
    |Nombre del docente a ingresar | nombre_docente_nuevo     | string                 |
    |Correo electrónico a ingresar | correo_electronico_nuevo | string                 |
     */

    // Ingresar docente nuevo

    this.docenteController = await this.app.get(DocenteController);

    this.resultado_ingresar_docente = await this.docenteController.createDocente({
        nombreCompleto: nombre_docente_nuevo,
        correoElectronico: correo_electronico_nuevo,
        codigoIngreso: " "
    });

});

Then('se registrará el código del docente {string}', async function (se_registro_codigo) {
    /*
    Los datos recibidos son: 
    |          Significado             | Nombre variable    | Tipo de dato necesario |
    | ¿Se generó y registró el código? | se_registro_codigo | boolean                 |
     */

    // Convertir a tipos de datos correspondientes

    this.se_registro_codigo = se_registro_codigo == "true";

    // Realizar comprobación

    assert.equal(this.resultado_ingresar_docente.se_registro_codigo, this.se_registro_codigo);
});

Then('se obtendrá una respuesta del envió de correo electrónico {string}', async function (respuesta_correo) {
    /*
    Los datos recibidos son: 
    |      Significado             | Nombre variable  | Tipo de dato necesario |
    | Mensaje del envió del correo | respuesta_correo | string                |
     */

    //Realizar comprobación

    assert.equal(this.resultado_ingresar_docente.respuesta_correo, respuesta_correo);
});

/* ESCENARIO 2 - Ingreso por archivo de docentes */

When('se ingrese varios docentes por medio de un archivo {string}', async function (path_archivo) {
    /*
    Los datos recibidos son:
    |       Significado       | Nombre variable  | Tipo de dato necesario |
    |  Dirección del archivo  | path_archivo     | string                 |
     */

    // Ingresar varios docentes por medio del archivo

    this.docenteController = await this.app.get(DocenteController);

    this.lecturaArchivo = fs.readFileSync(path_archivo);

    this.resultado_ingresar_varios_docentes = await this.docenteController.createVariosDocentes({ buffer: this.lecturaArchivo });
});

Then('se registrara {string} de códigos de los docentes', function (cantidad_de_codigos_generados) {
    /*
   Los datos recibidos son: 
   |          Significado          | Nombre variable               | Tipo de dato necesario |
   | Cantidad de códigos generados | cantidad_de_codigos_generados | number                 |
    */

    // Convertir a tipos de datos correspondientes

    cantidad_de_codigos_generados = Number(cantidad_de_codigos_generados);

    //Realizar comprobación

    assert.equal(this.resultado_ingresar_varios_docentes.cantidad_ingresos, cantidad_de_codigos_generados);
});

Then('se obtendrá una respuesta del envió de correos electrónicos {string}', function (respuesta_de_multiples_ingresos) {
    /*
   Los datos recibidos son: 
   |          Significado          | Nombre variable                 | Tipo de dato necesario |
   | Cantidad de códigos generados | respuesta_de_multiples_ingresos | string                 |
    */

    //Realizar comprobación

    assert.equal(this.resultado_ingresar_varios_docentes.respuesta_correo, respuesta_de_multiples_ingresos);
});
