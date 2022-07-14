const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');


/* ESCENARIO 1 - Ingreso individual de una asignatura */

Given('que se tiene una asignatura con código {string}, nombre {string}, cantidad de créditos {string}, código de requisito {string} y código de correquisito {string}', function (codigo_asignatura_existente, nombre_asignatura_existente, creditos_asignatura_existente, codigos_requisito_asignatura_existente, codigos_correquisito_asignatura_existente) {
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

    ingresar_asignatura(codigo_asignatura_existente, nombre_asignatura_existente, creditos_asignatura_existente, codigos_requisito_asignatura_existente, codigos_correquisito_asignatura_existente);
});

When('se ingrese el asignatura con código {string}, nombre {string}, cantidad de créditos {string}, código de requisito {string} y código de correquisito {string},', function (codigo_asignatura_nueva, nombre_asignatura_nueva, creditos_asignatura_nueva, codigos_requisito_asignatura_nueva, codigos_correquisito_asignatura_nueva) {
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

    creditos_asignatura_existente = Number(creditos_asignatura_existente);

    //Ingresar nueva asignatura

    this.resultado_ingresar_asignatura = ingresar_asignatura(codigo_asignatura_nueva, nombre_asignatura_nueva, creditos_asignatura_nueva, codigos_requisito_asignatura_nueva, codigos_correquisito_asignatura_nueva);

});

Then('se insertará {string}  asignaturas al sistema', function (cantidad_asignaturas_ingresados) {
    /*
    Los datos recibidos son: 
    |          Significado              | Nombre variable                 | Tipo de dato necesario |
    |Cantidad de asignaturas ingresados | cantidad_asignaturas_ingresados | number                 |
     */

    // Convertir a tipos de datos correspondientes

    cantidad_asignaturas_ingresados = Number(cantidad_asignaturas_ingresados);

    // Realizar comprobación

    assert.equal(this.resultado_ingresar_asignatura.cantitad_ingresos, cantidad_asignaturas_ingresados);
});

/* ESCENARIO 2 - Ingreso por archivo de asignaturas */

When('se ingrese varios asignaturas por medio de un archivo {string}', function (path_archivo) {
    /*
    Los datos recibidos son:
    |       Significado       | Nombre variable  | Tipo de dato necesario |
    |  Dirección del archivo  | path_archivo     | string                 |
     */

    // Ingresar varios docentes por medio del archivo

    this.resultado_ingresar_asignaturas = ingresar_docentes_archivo(path_archivo);
});

