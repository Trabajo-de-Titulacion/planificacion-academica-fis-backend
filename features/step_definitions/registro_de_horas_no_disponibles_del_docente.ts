import { HorasNoDisponiblesDTO } from '../../src/horas_no_disponibles/dto';
import { HorasNoDisponiblesController } from '../../src/horas_no_disponibles/controllers/horas_no_disponibles.controller';
import { DocenteEntity } from '../../src/docente/entities/docente.entity';
import { UsuarioEntity } from '../../src/usuarios/entities/usuario.entity';
import { RolEntity } from '../../src/auth/entities/rol.entity';
import { RolUsuarioEntity } from '../../src/auth/entities/rol-usuario.entity';
import { SemestreEntity } from '../../src/parametros-iniciales/entities/semestre.entity';
import { JornadaLaboralEntity } from '../../src/parametros-iniciales/entities/jornada-laboral.entity';
import { getRepository } from 'typeorm';

import { Given, When, Then, After } from '@cucumber/cucumber';
const assert = require('assert');

/* Se aprueba la solicitud horas no disponibles de un docente */

Given(
  'que existe un docente con correo mahatma.quijano@epn.edu.ec',
  async function () {
    // Rol
    this.rolDocente = getRepository(RolEntity).create();
    this.rolDocente.nombre = 'DocentePrueba';
    await getRepository(RolEntity).save(this.rolDocente);
    // Usuario
    this.docenteUsuario = getRepository(UsuarioEntity).create();
    this.docenteUsuario.correo = 'mahatma.quijano@epn.edu.ec';
    this.docenteUsuario.clave = 'Abcd1234!';
    await getRepository(UsuarioEntity).save(this.docenteUsuario);
    // RolUsuario
    this.rolUsuario = getRepository(RolUsuarioEntity).create();
    this.rolUsuario.rol = this.rolDocente.id;
    this.rolUsuario.usuario = this.docenteUsuario;
    await getRepository(RolUsuarioEntity).save(this.rolUsuario);
    // Docente
    this.docente = getRepository(DocenteEntity).create();
    this.docente.correoElectronico = 'mahatma.quijano@epn.edu.ec';
    this.docente.nombreCompleto = 'Nombre Docente';
    this.docente.usuario = this.docenteUsuario;
    await getRepository(DocenteEntity).save(this.docente);
  },
);

Given(
  'un semestre con jornada laboral de lunes a sábado desde las 7h hasta las 20h con almuerzo a las 13h',
  async function () {
    // Semestre
    this.semestre = getRepository(SemestreEntity).create({
      abreviatura: '2022-PruebaHoras',
    });
    await getRepository(SemestreEntity).save(this.semestre);
    // Jornada laboral
    const jornada = {
      horaInicio: '07:00',
      horaAlmuerzo: '13:00',
      horaFin: '20:00',
      semestre: this.semestre,
    };
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
  },
);

When(
  'se solicitan como horas no disponibles el día Martes de {int} a {int}',
  async function (horaInicio: number, horaFin: number) {
    this.horasNoDisponiblesController = await this.app.get(
      HorasNoDisponiblesController,
    );

    this.horasNoDisponibles1 = new HorasNoDisponiblesDTO(
      this.martes.id,
      horaInicio,
    );
  },
);

When(
  'el día Martes de {int} a {int}',
  async function (horaInicio: number, horaFin: number) {
    this.horasNoDisponibles2 = new HorasNoDisponiblesDTO(
      this.martes.id,
      horaInicio,
    );
  },
);

When(
  'también el día Jueves de {int} a {int}',
  async function (horaInicio: number, horaFin: number) {
    this.horasNoDisponibles3 = new HorasNoDisponiblesDTO(
      this.jueves.id,
      horaInicio,
    );

    await this.horasNoDisponiblesController.solicitarHorasNoDisponibles(
      this.docente.id,
      [
        this.horasNoDisponibles1,
        this.horasNoDisponibles2,
        this.horasNoDisponibles3,
      ],
    );
  },
);

When('el jefe de departamento aprueba la solicitud', async function () {
  this.resultadoAprobarSolicitud =
    await this.horasNoDisponiblesController.aprobarSolicitudHorasNoDisponiblesPorDocenteId(
      this.docente.id,
    );
});

Then(
  'al consultar la base de datos de horas no disponibles se observan {int} registros',
  async function (numeroRegistros: number) {
    // Se consulta a la base de datos
    this.registrosAlmacenados =
      await this.horasNoDisponiblesController.obtenerHorasNoDisponiblesSolicitadasPorDocenteId(
        this.docente.id,
      );

    // Numero de registros creados
    assert.equal(this.registrosAlmacenados.length, numeroRegistros);
  },
);

Then(
  'el docente recibe un correo electrónico indicando la aprobación de su solicitud.',
  async function () {
    const mensajeEsperado = `Solicitud aprobada. Se ha enviado la notificación respectiva al correo ${this.docente.correoElectronico}.`;
    // Correo recibido
    assert.equal(this.resultadoAprobarSolicitud.mensaje, mensajeEsperado);
  },
);

/* Se rechaza la solicitud horas no disponibles de un docente */

// Dado que la mayor parte de steps son iguales en ambos escenarios,
// para la segunda prueba solo se escriben los que son diferentes
When('el jefe de departamento rechaza la solicitud', async function () {
  this.resultadoRechazarSolicitud =
    await this.horasNoDisponiblesController.rechazarSolicitudHorasNoDisponiblesPorDocenteId(
      this.docente.id,
    );
});

Then(
  'el docente recibe un correo electrónico indicando el rechazo de su solicitud.',
  async function () {
    const mensajeEsperado = `Solicitud rechazada. Se ha enviado la notificación respectiva al correo ${this.docente.correoElectronico}.`;
    // Correo recibido
    assert.equal(this.resultadoRechazarSolicitud.mensaje, mensajeEsperado);
  },
);

// Borrar datos de la prueba 1
After('@horasNoDisponiblesPruebaHorasAprobadas', async function () {
  // Borrar registros creados en el Dado
  await getRepository(RolUsuarioEntity).delete(this.rolUsuario);
  await getRepository(RolEntity).delete(this.rolDocente);
  await getRepository(DocenteEntity).delete(this.docente);
  await getRepository(UsuarioEntity).delete(this.docenteUsuario);
  await getRepository(SemestreEntity).delete(this.semestre);
});

// Borrar datos de la prueba 2
After('@horasNoDisponiblesPruebaHorasRechazadas', async function () {
  // Borrar registros creados en el Dado
  await getRepository(RolUsuarioEntity).delete(this.rolUsuario);
  await getRepository(RolEntity).delete(this.rolDocente);
  await getRepository(DocenteEntity).delete(this.docente);
  await getRepository(UsuarioEntity).delete(this.docenteUsuario);
  await getRepository(SemestreEntity).delete(this.semestre);
});
