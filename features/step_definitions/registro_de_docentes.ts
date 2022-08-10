const assert = require('assert');
import { Given, When, Then, After } from '@cucumber/cucumber';
import { DocenteController } from '../../src/docente/controllers/docente.controller';
import { DocenteEntity } from '../../src/docente/entities/docente.entity';
import { UsuariosController } from '../../src/usuarios/controllers/usuario.controller';
import { UsuarioEntity } from '../../src/usuarios/entities/usuario.entity';
import { RolUsuarioEntity } from '../../src/auth/entities/rol-usuario.entity';
import { RolUsuarioController } from '../../src/auth/controllers/rol-usuario.controller';
import { getRepository } from 'typeorm';
import * as fs from 'fs';

/* ESCENARIO 1 - Ingreso individual de un docente */

Given('que se tiene un docente llamado {string} con el correo electrónico {string}', { timeout: 5 * 5000 }, async function (nombre_docente, correo_electronico) {
    /*
    Los datos recibidos son:
    |          Significado        | Nombre variable    | Tipo de dato necesario |
    |Nombre del docente existente | nombre_docente     | string                 |
    |Correo electrónico existente | correo_electronico | string                 |
    */

    // Declarar e ingresar docente previo para comprobación

    this.docenteExistente = {
        nombreCompleto: nombre_docente,
        correoElectronico: correo_electronico
    }

    await getRepository(DocenteEntity).save(this.docenteExistente);

});

When('se ingrese el docente llamado {string} con el correo electrónico {string},', { timeout: 5 * 5000 }, async function (nombre_docente_nuevo, correo_electronico_nuevo) {
    /*
    Los datos recibidos son:
    |          Significado         | Nombre variable          | Tipo de dato necesario |
    |Nombre del docente a ingresar | nombre_docente_nuevo     | string                 |
    |Correo electrónico a ingresar | correo_electronico_nuevo | string                 |
     */

    // Ingresar docente nuevo

    this.docenteController = await this.app.get(DocenteController);

    this.docenteNuevo = {
        nombreCompleto: nombre_docente_nuevo,
        correoElectronico: correo_electronico_nuevo
    };

    this.resultado_ingresar_docente = await this.docenteController.crearDocente(this.docenteNuevo);

});

Then('al leer la base de datos se podrá observar que el código del docente se generó existosamente', { timeout: 5 * 5000 }, async function () {

    // Llamar al método de lectura de la base de datos de un docente (y su usuario espectivo)

    this.usuarioController = await this.app.get(UsuariosController);
    //this.usuarioDeTipoDocenteCreado1 = await this.usuarioController. 
    // this.usuarioDeTipoDocenteCreado = await getRepository(UsuarioEntity).findOne({ correo: this.docenteNuevo.correoElectronico });

    assert.equal(typeof this.usuarioDeTipoDocenteCreado.clave, typeof "string");
});

Then('se obtendrá una respuesta del envió de correo electrónico {string}', async function (respuesta_correo) {
    /*
    Los datos recibidos son: 
    |      Significado             | Nombre variable  | Tipo de dato necesario |
    | Mensaje del envió del correo | respuesta_correo | string                 |
     */

    //Realizar comprobación

    assert.equal(this.resultado_ingresar_docente.respuesta_correo, respuesta_correo);
});

After("@Registro_de_docente", async function () {

    // Eliminar docentes usados
    await getRepository(DocenteEntity).delete(this.docenteExistente);
    await getRepository(DocenteEntity).delete(this.docenteNuevo);

    this.rolUsuarioController = await this.app.get(RolUsuarioController);
    const rolDocente = await getRepository(RolUsuarioEntity).findOne({ where: { id: this.usuarioDeTipoDocenteCreado.id } });
    await getRepository(RolUsuarioEntity).delete(rolDocente);

    this.usuarioController = await this.app.get(UsuariosController);
    await getRepository(UsuarioEntity).delete(this.usuarioDeTipoDocenteCreado)

});

/* ESCENARIO 2 - Ingreso por archivo de docentes */

When('se ingrese varios docentes por medio de un archivo {string}', { timeout: 5 * 5000 }, async function (path_archivo) {
    /*
    Los datos recibidos son:
    |       Significado       | Nombre variable  | Tipo de dato necesario |
    |  Dirección del archivo  | path_archivo     | string                 |
     */

    // Ingresar varios docentes por medio del archivo

    this.docenteController = await this.app.get(DocenteController);

    this.lecturaArchivo = fs.readFileSync(path_archivo);

    this.resultado_ingresar_varios_docentes = await this.docenteController.crearVariosDocentes({ buffer: this.lecturaArchivo });
});

Then('se registrara {string} de códigos de los docentes', { timeout: 5 * 5000 }, function (cantidad_de_claves_generados) {
    /*
   Los datos recibidos son: 
   |          Significado          | Nombre variable               | Tipo de dato necesario |
   | Cantidad de códigos generados | cantidad_de_claves_generados | number                 |
    */

    // Convertir a tipos de datos correspondientes

    cantidad_de_claves_generados = Number(cantidad_de_claves_generados);

    //Realizar comprobación

    assert.equal(this.resultado_ingresar_varios_docentes.cantidad_ingresos, cantidad_de_claves_generados);
});

Then('se obtendrá una respuesta del envió de correos electrónicos {string}', { timeout: 5 * 5000 }, function (respuesta_de_multiples_ingresos) {
    /*
   Los datos recibidos son: 
   |          Significado          | Nombre variable                 | Tipo de dato necesario |
   | Cantidad de códigos generados | respuesta_de_multiples_ingresos | string                 |
    */

    //Realizar comprobación

    assert.equal(this.resultado_ingresar_varios_docentes.respuesta_correo, respuesta_de_multiples_ingresos);
});

After("@Registro_de_varios_docentes", async function () {

    // Eliminar docentes usados
    await getRepository(DocenteEntity).delete(this.docenteExistente);

    for (let i = 0; i < this.resultado_ingresar_varios_docentes.docentes_ingresados; i++) {
        await getRepository(UsuarioEntity).delete({
            correo: this.resultado_ingresar_varios_docentes.docentes_ingresados[i].correoElectronico,
            clave: this.resultado_ingresar_varios_docentes.docentes_ingresados[i].clave
        })
    }

    for (let i = 0; i < this.resultado_ingresar_varios_docentes.docentes_ingresados; i++) {
        await getRepository(DocenteEntity).delete({
            correoElectronico: this.resultado_ingresar_varios_docentes.docentes_ingresados[i].correoElectronico,
            nombreCompleto: this.resultado_ingresar_varios_docentes.docentes_ingresados[i].nombreCompleto
        })
    }
});