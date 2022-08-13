import { HorasNoDisponiblesDTO } from "../../src/horas_no_disponibles/dto";
import { HorasNoDisponiblesController } from "../../src/horas_no_disponibles/controllers/horas_no_disponibles.controller";
import { HoraNoDisponibleEntity } from "../../src/horas_no_disponibles/entities/hora_no_disponible.entity";
import { DocenteEntity } from "../../src/docente/entities/docente.entity";
import { UsuarioEntity } from "../../src/usuarios/entities/usuario.entity";
import { RolEntity } from "../../src/auth/entities/rol.entity";
import { RolUsuarioEntity } from "../../src/auth/entities/rol-usuario.entity";
import { SemestreEntity } from "../../src/parametros-iniciales/entities/semestre.entity";
import { JornadaLaboralEntity } from "../../src/parametros-iniciales/entities/jornada-laboral.entity";
import { getRepository } from "typeorm";

import { Given, When, Then, After } from '@cucumber/cucumber';
const assert = require('assert');


/* Se agregan horas no disponibles de un docente */

Given('que existe un docente con correo docente.prueba@epn.edu.ec', async function () {
    // Rol
    this.rolDocente = getRepository(RolEntity).create();
    this.rolDocente.nombre = 'DocentePrueba';
    await getRepository(RolEntity).save(this.rolDocente);
    // Usuario
    this.docenteUsuario = getRepository(UsuarioEntity).create();
    this.docenteUsuario.correo = 'docente.prueba@epn.edu.ec';
    this.docenteUsuario.clave = 'Abcd1234!';
    await getRepository(UsuarioEntity).save(this.docenteUsuario);
    // RolUsuario
    this.rolUsuario = getRepository(RolUsuarioEntity).create();
    this.rolUsuario.rol = this.rolDocente.id;
    this.rolUsuario.usuario = this.docenteUsuario;
    await getRepository(RolUsuarioEntity).save(this.rolUsuario);
    // Docente
    this.docente = getRepository(DocenteEntity).create();
    this.docente.correoElectronico = 'docente.prueba@epn.edu.ec';
    this.docente.nombreCompleto = 'Nombre Docente';
    this.docente.usuario = this.docenteUsuario;
    await getRepository(DocenteEntity).save(this.docente);
});

Given('un semestre con jornada laboral de lunes a sábado desde las 7h hasta las 20h con almuerzo a las 13h', async function () {
    // Semestre
    this.semestre = getRepository(SemestreEntity).create({ abreviatura: '2022-Prueba'});
    await getRepository(SemestreEntity).save(this.semestre);
    // Jornada laboral
    const jornada = { horaInicio: '07:00', horaAlmuerzo: '13:00', horaFin: '20:00', semestre: this.semestre };
    this.lunes = getRepository(JornadaLaboralEntity).create(jornada);
    this.lunes.dia = 'LUNES';
    await getRepository(JornadaLaboralEntity).save(this.lunes);
    this.martes = getRepository(JornadaLaboralEntity).create(jornada);
    this.martes.dia = 'MARTES';
    await getRepository(JornadaLaboralEntity).save(this.martes);
    this.miercoles = getRepository(JornadaLaboralEntity).create(jornada);
    this.miercoles.dia = 'MIÉRCOLES';
    await getRepository(JornadaLaboralEntity).save(this.miercoles);
    this.jueves = getRepository(JornadaLaboralEntity).create(jornada);
    this.jueves.dia = 'JUEVES';
    await getRepository(JornadaLaboralEntity).save(this.jueves);
    this.viernes = getRepository(JornadaLaboralEntity).create(jornada);
    this.viernes.dia = 'VIERNES';
    await getRepository(JornadaLaboralEntity).save(this.viernes);
    this.sabado = getRepository(JornadaLaboralEntity).create(jornada);
    this.sabado.dia = 'SÁBADO';
    await getRepository(JornadaLaboralEntity).save(this.sabado);
});


When('se agregan como horas no disponibles el día Martes de {int} a {int}', async function (hora_inicio: number, hora_fin: number) {
    this.horasNoDisponiblesController = await this.app.get(HorasNoDisponiblesController);

    this.horas_no_disponibles1 = new HorasNoDisponiblesDTO(this.docente.id, this.martes.id, hora_inicio);
});

When('el día Martes de {int} a {int}', async function (hora_inicio: number, hora_fin: number) {
    this.horas_no_disponibles2 = new HorasNoDisponiblesDTO(this.docente.id, this.martes.id, hora_inicio);
});

When('también el día Jueves de {int} a {int}', async function (hora_inicio: number, hora_fin: number) {
    this.horas_no_disponibles3 = new HorasNoDisponiblesDTO(this.docente.id, this.jueves.id, hora_inicio);

    await this.horasNoDisponiblesController.crearHorasNoDisponibles([
        this.horas_no_disponibles1, this.horas_no_disponibles2, this.horas_no_disponibles3
    ]);
});


Then('al consultar la base de datos se observan {int} registros.', async function (numero_registros: number) {
    // Se consulta a la base de datos
    this.registros_almacenados = this.horasNoDisponiblesController.obtenerHorasNoDisponiblesPorDocenteId(this.docente.id);
    
    // Numero de registros creados
    assert.equal(this.registros_almacenados.length, numero_registros);
});


// Borrar datos de la prueba
After("@horas_no_disponibles_prueba1", async function () {
    // Borrar registros creados en el Dado
    await getRepository(RolUsuarioEntity).delete(this.rolUsuario);
    await getRepository(RolEntity).delete(this.rolDocente);
    await getRepository(DocenteEntity).delete(this.docente);
    await getRepository(UsuarioEntity).delete(this.docenteUsuario);
    await getRepository(SemestreEntity).delete(this.semestre);
});