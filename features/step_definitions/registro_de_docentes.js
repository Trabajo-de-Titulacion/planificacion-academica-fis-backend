const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');

/* ESCENARIO 1 - Ingreso individual de un docente */

Given('que se tiene un docente llamado {string} con el correo electrónico {string}', function (nombre_docente, correo_electronico) {
    /*
    Los datos recibidos son:
    |          Significado        | Nombre variable    | Tipo de dato necesario |
    |Nombre del docente existente | nombre_docente     | string                 |
    |Correo electrónico existente | correo_electronico | string                 |
    */

    // Ingresar docente previo para comprobación

    ingresar_docente(nombre_docente, correo_electronico);

});

When('se ingrese el docente llamado {string} con el correo electrónico {string},', function (nombre_docente_nuevo, correo_electronico_nuevo) {
    /*
    Los datos recibidos son:
    |          Significado         | Nombre variable          | Tipo de dato necesario |
    |Nombre del docente a ingresar | nombre_docente_nuevo     | string                 |
    |Correo electrónico a ingresar | correo_electronico_nuevo | string                 |
     */

    // Ingresar docente nuevo

    this.resultado_ingresar_docente = ingresar_docente(nombre_docente_nuevo, correo_electronico_nuevo);
});

Then('se insertará {string}', function (cantidad_docentes_ingresados) {
    /*
    Los datos recibidos son: 
    |          Significado           | Nombre variable              | Tipo de dato necesario |
    |Cantidad de docentes ingresados | cantidad_docentes_ingresados | number                 |
     */

    // Convertir a tipos de datos correspondientes

    cantidad_docentes_ingresados = Number(cantidad_docentes_ingresados);

    // Realizar comprobación

    assert.equal(this.resultado_ingresar_docente.cantitad_ingresos, cantidad_docentes_ingresados);
});

Then('se generará un código aleatorio {string}', function (codigo_generado) {
    /*
    Los datos recibidos son: 
    |      Significado      | Nombre variable  | Tipo de dato necesario |
    | ¿El código se generó? | codigo_ generado | boolean                |
     */

    // Convertir a tipos de datos correspondientes

    codigo_generado = Boolean(codigo_generado);

    //Realizar comprobación

    assert.equal(this.resultado_ingresar_docente.codigo_booleano, codigo_generado);
});

/* ESCENARIO 2 - Ingreso por archivo de docentes */

When('se ingrese varios docentes por medio de un archivo {string}', function (path_archivo) {
    /*
    Los datos recibidos son:
    |       Significado       | Nombre variable  | Tipo de dato necesario |
    |  Dirección del archivo  | path_archivo     | string                 |
     */

    // Ingresar varios docentes por medio del archivo

    this.resultado_ingresar_docentes_archivo = ingresar_docentes_archivo(path_archivo);
});

Then('se generarán códigos aleatorios {string}', function (cantidad_codigos_generados) {
    /*
   Los datos recibidos son: 
   |          Significado          | Nombre variable            | Tipo de dato necesario |
   | Cantidad de códigos generados | cantidad_codigos_generados | number               |
    */

    // Convertir a tipos de datos correspondientes

    cantidad_codigos_generados = Number(cantidad_codigos_generados);

    //Realizar comprobación

    assert.equal(cantidad_codigos_generados.cantidad_ingresos, cantidad_codigos_generados);
});
