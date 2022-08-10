const assert = require('assert');
import { Given, When, Then } from '@cucumber/cucumber';
import { CarreraController } from '../../src/carrera/controllers/carrera.controller';
import { CarreraEntity } from '../../src/carrera/entities/carrera.entity';
import { getRepository } from 'typeorm';


/* ESCENARIO 1 - Ingreso individual de un carrera */

Given('que se tiene una carrera con código {string}, nombre {string}, duración {string} y modalidad {string}', async function (codigo_carrera_existente, nombre_carrera_existente, duracion_carrera_existente, modalidad_carrera_existente) {
    /*
    Los datos recibidos son:
    |   Significado                     | Nombre variable             | Tipo de dato necesario |
    |Código de la carrera               | codigo_carrera_existente    | string                 |
    |Nombre de la carrera               | nombre_carrera_existente    | string                 |
    |Duración de la carrera (semestres) | duracion_carrera_existente  | number                 |
    |Modalidad de la carrrera           | modalidad_carrera_existente | string                 |
    */

    // Convertir a tipos de datos correspondientes

    duracion_carrera_existente = Number(duracion_carrera_existente);

    // Declarar e ingresar la carrera previa para comprobación

    await getRepository(CarreraEntity).save({
        codigo: codigo_carrera_existente,
        nombre: nombre_carrera_existente,
        duracion: duracion_carrera_existente,
        modalidad: modalidad_carrera_existente
    })
});

When('se ingrese una carrera con código {string}, nombre {string}, duración {string} y modalidad {string}', async function (codigo_carrera_nueva, nombre_carrera_nueva, duracion_carrera_nueva, modalidad_carrera_nueva) {
    /*
    Los datos recibidos son:
    |   Significado                     | Nombre variable         | Tipo de dato necesario |
    |Código de la carrera               | codigo_carrera_nueva    | string                 |
    |Nombre de la carrera               | nombre_carrera_nueva    | string                 |
    |Duración de la carrera (semestres) | duracion_carrera_nueva  | number                 |
    |Modalidad de la carrrera           | modalidad_carrera_nueva | string                 |
    */

    // Ingresar carrera nueva

    this.carreraController = await this.app.get(CarreraController);
    this.resultado_ingresar_carrera = await this.carreraController.createCarrera({
        codigo: codigo_carrera_nueva,
        nombre: nombre_carrera_nueva,
        duracion: duracion_carrera_nueva,
        modalidad: modalidad_carrera_nueva
    })

});

Then('se obtendrá la respuesta {string} del sistema', async function (respuesta_ingreso_carrera) {
    /*
    Los datos recibidos son: 
    |           Significado           | Nombre variable              | Tipo de dato necesario |
    | Cantidad de carreras ingresadas | cantidad_carreras_ingresados | string                 |
     */

    // Realizar comprobación

    assert.equal(this.resultado_ingresar_carrera, respuesta_ingreso_carrera);
});

