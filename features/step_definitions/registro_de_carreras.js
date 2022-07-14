const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');


/* ESCENARIO 1 - Ingreso individual de un carrera */

Given('que se tiene una carrera con código {string}, nombre {string}, duración {string} y modalidad {string}', function (codigo_carrera_existente, nombre_carrera_existente, duracion_carrera_existente, modalidad_carrera_existente) {
    /*
    Los datos recibidos son:
    |   Significado                     | Nombre variable             | Tipo de dato necesario |
    |Código de la carrera               | codigo_carrera_existente    | string                 |
    |Nombre de la carrera               | nombre_carrera_existente    | string                 |
    |Duración de la carrera (semestres) | duracion_carrera_existente  | number                 |
    |Modalidad de la carrrera           | modalidad_carrera_existente | string                 |
    */

    // Convertir a tipos de datos correspondientes

    duracion_carrera_existente = Boolean(duracion_carrera_existente);

    // Ingresar carrera previo para comprobación

    ingresar_carrera(codigo_carrera_existente, nombre_carrera_existente, duracion_carrera_existente, modalidad_carrera_existente);
});

When('se ingrese una carrera con código {string}, nombre {string}, duración {string} y modalidad {string}', function (codigo_carrera_nueva, nombre_carrera_nueva, duracion_carrera_nueva, modalidad_carrera_nueva) {
    /*
    Los datos recibidos son:
    |   Significado                     | Nombre variable         | Tipo de dato necesario |
    |Código de la carrera               | codigo_carrera_nueva    | string                 |
    |Nombre de la carrera               | nombre_carrera_nueva    | string                 |
    |Duración de la carrera (semestres) | duracion_carrera_nueva  | number                 |
    |Modalidad de la carrrera           | modalidad_carrera_nueva | string                 |
    */

    // Ingresar carrera nueva

    this.resultado_ingresar_carrera = ingresar_carrera(codigo_carrera_nueva, nombre_carrera_nueva, duracion_carrera_nueva, modalidad_carrera_nueva);
});

Then('se insertará {string} al sistema', function (cantidad_carreras_ingresados) {
    /*
    Los datos recibidos son: 
    |           Significado           | Nombre variable              | Tipo de dato necesario |
    | Cantidad de carreras ingresadas | cantidad_carreras_ingresados | number                 |
     */

    // Convertir a tipos de datos correspondientes

    cantidad_carreras_ingresados = Number(cantidad_carreras_ingresados);

    // Realizar comprobación

    assert.equal(this.resultado_ingresar_carrera.cantidad, cantidad_carreras_ingresados);
});

