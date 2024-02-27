import { EspacioFisicoDTO } from '../../src/espacios_fisicos/dto';
import { EspacioFisicoEntity } from '../../src/espacios_fisicos/entities/espacio_fisico.entity';
import { EspaciosFisicosController } from '../../src/espacios_fisicos/controllers/espacios_fisicos.controller';
import { FacultadEntity } from '../../src/parametros-iniciales/entities/facultad.entity';
import { TipoAulaEntity } from '../../src/parametros-iniciales/entities/tipo-aula.entity';
import * as fs from 'fs';
const path = require('path');

import { Given, When, Then, After } from '@cucumber/cucumber';
import { getRepository } from 'typeorm';
const assert = require('assert');

/* Se agrega un espacio físico */

Given(
  'que existe un espacio fisico llamado {string}',
  async function (nombreEspacioFisico: string) {
    this.facultad = getRepository(FacultadEntity).create();
    this.facultad.nombre = 'Facultad Prueba Espacios Fisicos';
    await getRepository(FacultadEntity).save(this.facultad);

    this.aula = getRepository(TipoAulaEntity).create();
    this.aula.tipo = 'AULA';
    this.aula.facultad = this.facultad;
    await getRepository(TipoAulaEntity).save(this.aula);

    this.laboratorio = getRepository(TipoAulaEntity).create();
    this.laboratorio.tipo = 'LABORATORIO';
    this.laboratorio.facultad = this.facultad;
    await getRepository(TipoAulaEntity).save(this.laboratorio);

    this.espacioFisicoExistente = new EspacioFisicoDTO(
      nombreEspacioFisico,
      this.laboratorio.id,
      25,
    );
    await getRepository(EspacioFisicoEntity).save(this.espacioFisicoExistente);
  },
);

When(
  'se agrega un espacio fisico llamado {string}',
  async function (nombreEspacioFisico: string) {
    this.espaciosFisicosController = await this.app.get(
      EspaciosFisicosController,
    );

    this.nuevoEspacioFisico = new EspacioFisicoDTO(
      nombreEspacioFisico,
      this.laboratorio.id,
      25,
    );

    await this.espaciosFisicosController.crearEspacioFisico(
      this.nuevoEspacioFisico,
    );
  },
);

Then(
  'al consultar la base de datos se observan {string} registros.',
  async function (numeroRegistros: number) {
    // Se consulta a la base de datos y se obtiene lo almacenado
    this.registrosAlmacenados =
      await this.espaciosFisicosController.obtenerEspaciosFisicos();

    // Se compara si la consulta devuelve los mismos registros que se deseó guardar
    assert.equal(this.registrosAlmacenados.length, numeroRegistros);
  },
);

// Borrar datos de la primera prueba
After('@espaciosFisicosPruebaCrearUnEspacioFisico', async function () {
  // Borrar registro creado en el Dado
  await getRepository(EspacioFisicoEntity).delete({
    nombre: this.espacioFisicoExistente.nombre,
  });
  // Borrar registro creado en el Cuando
  await getRepository(EspacioFisicoEntity).delete({
    nombre: this.nuevoEspacioFisico.nombre,
  });

  // Borrar registros creados en el Before
  await getRepository(FacultadEntity).delete(this.facultad);
});

/* Se agrega un archivo con múltiples espacios físicos */

Given('que existe un espacio físico llamado BetaPrueba', async function () {
  this.facultad = getRepository(FacultadEntity).create();
  this.facultad.nombre = 'Facultad Prueba Espacios Fisicos';
  await getRepository(FacultadEntity).save(this.facultad);

  this.aula = getRepository(TipoAulaEntity).create();
  this.aula.tipo = 'AULA';
  this.aula.facultad = this.facultad;
  await getRepository(TipoAulaEntity).save(this.aula);

  this.laboratorio = getRepository(TipoAulaEntity).create();
  this.laboratorio.tipo = 'LABORATORIO';
  this.laboratorio.facultad = this.facultad;
  await getRepository(TipoAulaEntity).save(this.laboratorio);

  this.repository = await getRepository(EspacioFisicoEntity);
  this.espacioFisicoExistente1 = new EspacioFisicoDTO(
    'BetaPrueba',
    this.laboratorio.id,
    25,
  );
  await this.repository.save(this.espacioFisicoExistente1);
});
Given('existe un espacio físico llamado AlfaPrueba', async function () {
  this.espacioFisicoExistente2 = new EspacioFisicoDTO(
    'AlfaPrueba',
    this.laboratorio.id,
    25,
  );
  await this.repository.save(this.espacioFisicoExistente2);
});
Given('existe un espacio físico llamado GammaPrueba', async function () {
  this.espacioFisicoExistente3 = new EspacioFisicoDTO(
    'GammaPrueba',
    this.laboratorio.id,
    25,
  );
  await this.repository.save(this.espacioFisicoExistente3);
});
Given('existe un espacio físico llamado SIS502Prueba', async function () {
  this.espacioFisicoExistente4 = new EspacioFisicoDTO(
    'SIS502Prueba',
    this.aula.id,
    25,
  );
  await this.repository.save(this.espacioFisicoExistente4);
});

When('se importe el archivo {string}', async function (nombreArchivo: string) {
  // Se obtiene el archivo
  const direccion = path.join(__dirname, '..', 'documents_test', nombreArchivo);
  this.archivoBuffer = fs.readFileSync(direccion);
  this.archivo = { buffer: this.archivoBuffer };

  // Se obtiene una instancia del controlador
  this.espaciosFisicosController = await this.app.get(
    EspaciosFisicosController,
  );

  this.respuesta =
    await this.espaciosFisicosController.crearMultiplesEspaciosFisicos(
      this.archivo,
    );
});

Then(
  'al consultar la base de datos se observan {string} espacios físicos.',
  async function (numeroRegistros: number) {
    // Se consulta a la base de datos y se obtiene lo almacenado
    this.registrosAlmacenados =
      await this.espaciosFisicosController.obtenerEspaciosFisicos();

    // Numero de filas ingresadas
    assert.equal(this.registrosAlmacenados.length, numeroRegistros);
  },
);

// Borrar datos de la segunda prueba
After('@espaciosFisicosPruebaCrearMultiplesEspaciosFisicos', async function () {
  // Borrar registros creados en cada Dado
  await this.repository.delete({ nombre: this.espacioFisicoExistente1.nombre });
  await this.repository.delete({ nombre: this.espacioFisicoExistente2.nombre });
  await this.repository.delete({ nombre: this.espacioFisicoExistente3.nombre });
  await this.repository.delete({ nombre: this.espacioFisicoExistente4.nombre });
  await getRepository(FacultadEntity).delete(this.facultad);

  // Borrar registros creados en el Cuando
  for (const registro of this.respuesta.registrosCreados) {
    await this.repository.delete(registro);
  }
});
