const assert = require('assert');
import { Given, When, Then, After } from '@cucumber/cucumber';
import { DocenteController } from '../../src/docente/controllers/docente.controller';
import { DocenteEntity } from '../../src/docente/entities/docente.entity';
import { UsuariosController } from '../../src/usuarios/controllers/usuario.controller';
import { UsuarioEntity } from '../../src/usuarios/entities/usuario.entity';
import { RolUsuarioEntity } from '../../src/auth/entities/rol-usuario.entity';
import { RolUsuarioController } from '../../src/auth/controllers/rol-usuario.controller';
import { UsuarioService } from '../../src/usuarios/services/usuario.service';
import { getRepository } from 'typeorm';
import * as fs from 'fs';

const path = require('path');

/* ESCENARIO 1 - Ingreso individual de un docente */

Given('que se tiene un docente llamado {string} con el correo electrónico {string}', { timeout: 5 * 5000 }, async function (nombreDocente, correoElectronico) {
    /*
    Los datos recibidos son:
    |          Significado        | Nombre variable   | Tipo de dato necesario |
    |Nombre del docente existente | nombreDocente     | string                 |
    |Correo electrónico existente | correoElectronico | string                 |
    */

    // Declarar e ingresar docente previo para comprobación

    this.docenteExistente = {
        nombreCompleto: nombreDocente,
        correoElectronico: correoElectronico
    }

    await getRepository(DocenteEntity).save(this.docenteExistente);

});

When('se ingrese el docente llamado {string} con el correo electrónico {string}', { timeout: 5 * 5000 }, async function (nombreDocenteNuevo, correoElectronicoNuevo) {
    /*
    Los datos recibidos son:
    |          Significado         | Nombre variable        | Tipo de dato necesario |
    |Nombre del docente a ingresar | nombreDocenteNuevo     | string                 |
    |Correo electrónico a ingresar | correoElectronicoNuevo | string                 |
     */

    // Ingresar docente nuevo

    this.docenteController = await this.app.get(DocenteController);

    this.docenteNuevo = {
        nombreCompleto: nombreDocenteNuevo,
        correoElectronico: correoElectronicoNuevo
    };

    this.resultadoIngresarDocente = await this.docenteController.crearDocente(this.docenteNuevo);

});

Then('al leer la base de datos se podrá observar que la clave del docente se generó existosamente', { timeout: 5 * 5000 }, async function () {

    // Llamar al método de lectura de la base de datos de un docente (usuario)

    this.usuarioService = await this.app.get(UsuarioService);
    this.usuarioDeTipoDocenteCreado = await this.usuarioService.obtenerUsuarioPorSuCorreo(this.docenteNuevo.correoElectronico);
    if (this.usuarioDeTipoDocenteCreado) {
        assert.equal(typeof this.usuarioDeTipoDocenteCreado.clave, typeof "string");
    }
});

Then('se obtendrá una respuesta del envío de correo electrónico {string}.', async function (respuestaCorreo) {
    /*
    Los datos recibidos son: 
    |      Significado             | Nombre variable  | Tipo de dato necesario |
    | Mensaje del envío del correo | respuestaCorreo  | string                 |
     */

    //Realizar comprobación
    assert.equal(this.resultadoIngresarDocente.mensaje, respuestaCorreo);
});

After("@RegistroDeDocente", async function () {

    // Eliminar docentes usados
    await getRepository(DocenteEntity).delete(this.docenteExistente);
    await getRepository(DocenteEntity).delete(this.docenteNuevo);

    if (this.usuarioDeTipoDocenteCreado) {
        this.rolUsuarioController = await this.app.get(RolUsuarioController);
        const rolDocente = await getRepository(RolUsuarioEntity).findOne({ where: { usuario: this.usuarioDeTipoDocenteCreado } });
        await getRepository(RolUsuarioEntity).delete(rolDocente);
        this.usuarioController = await this.app.get(UsuariosController);
        await getRepository(UsuarioEntity).delete(this.usuarioDeTipoDocenteCreado)
    }

});

/* ESCENARIO 2 - Ingreso por archivo de docentes */

When('se ingrese varios docentes por medio de un archivo csv {string}', { timeout: 5 * 5000 }, async function (nombreArchivo) {
    /*
    Los datos recibidos son:
    |       Significado       | Nombre variable  | Tipo de dato necesario |
    |  Nombre del archivo     | nombreArchivo    | string                 |
     */

    // Ingresar varios docentes por medio del archivo

    this.docenteController = await this.app.get(DocenteController);
    const pathArchivo = path.join(__dirname, "..", "documents_test", nombreArchivo);
    this.lecturaArchivo = fs.readFileSync(pathArchivo);
    this.resultadoIngresarVariosDocentes = await this.docenteController.crearVariosDocentes({ buffer: this.lecturaArchivo });
});

Then('al leer la base de datos se podrá observar que todos los docentes registrados tienen una clave', { timeout: 5 * 5000 }, async function () {

    // Llamar al método de lectura de la base de datos de los docentes (usuario)
    this.usuarioService = await this.app.get(UsuarioService);
    for (let i = 0; i < this.resultadoIngresarVariosDocentes.docentesIngresados.length; i++) {
        this.usuarioDeTipoDocenteCreado = await this.usuarioService.obtenerUsuarioPorSuCorreo(this.resultadoIngresarVariosDocentes.docentesIngresados[i].correoElectronico);
        if (this.usuarioDeTipoDocenteCreado) {
            assert.equal(typeof this.usuarioDeTipoDocenteCreado.clave, typeof "string");
        }
    }

});

Then('se obtendrá una respuesta del envío de correos electrónicos {string}.', { timeout: 5 * 5000 }, async function (respuestaDeMultiplesIngresos) {
    /*
   Los datos recibidos son: 
   |          Significado          | Nombre variable              | Tipo de dato necesario |
   | Respuesta de la base de datos | respuestaDeMultiplesIngresos | string                 |
    */

    //Realizar comprobación
    assert.equal(this.resultadoIngresarVariosDocentes.mensaje, respuestaDeMultiplesIngresos);


});

After("@RegistroDeVariosDocentes", async function () {

    // Eliminar docentes usados y/o docentes y usuarios creados
    await getRepository(DocenteEntity).delete(this.docenteExistente);

    for (let i = 0; i < this.resultadoIngresarVariosDocentes.docentesIngresados.length; i++) {
        const usuario = await getRepository(UsuarioEntity).findOne({ where: { correo: this.resultadoIngresarVariosDocentes.docentesIngresados[i].correoElectronico } });
        await getRepository(DocenteEntity).delete(this.resultadoIngresarVariosDocentes.docentesIngresados[i]);
        const rol = await getRepository(RolUsuarioEntity).findOne({ where: { usuario: usuario } });
        await getRepository(RolUsuarioEntity).delete(rol);
        await getRepository(UsuarioEntity).delete(usuario);
    }

});