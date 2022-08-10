import { EspacioFisicoDTO } from "../../src/espacios_fisicos/dto"
import { EspacioFisicoEntity } from "../../src/espacios_fisicos/entities/espacio_fisico.entity"
import { EspaciosFisicosController } from "../../src/espacios_fisicos/controllers/espacios_fisicos.controller";
import { FacultadEntity } from "../../src/parametros-iniciales/entities/facultad.entity";
import { TipoAulaEntity } from "../../src/parametros-iniciales/entities/tipo-aula.entity";
import * as fs from 'fs';
const path = require('path')

import { Given, When, Then, After, Before } from "@cucumber/cucumber"
import { getRepository } from "typeorm";
const assert = require('assert');


/* Se agrega un espacio físico */

Given('que existe un espacio fisico llamado {string}', async function (nombre_espacio_fisico: string) {
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


    this.espacio_fisico_existente = new EspacioFisicoDTO(nombre_espacio_fisico, this.laboratorio.id, 25);
    await getRepository(EspacioFisicoEntity).save(this.espacio_fisico_existente);
});

When('se agrega un espacio fisico llamado {string}', async function (nombre_espacio_fisico: string) {
    this.espaciosFisicosController = await this.app.get(EspaciosFisicosController);

    this.nuevo_espacio_fisico = new EspacioFisicoDTO(nombre_espacio_fisico, this.laboratorio.id, 25);
    
    await this.espaciosFisicosController.crearEspacioFisico(this.nuevo_espacio_fisico);
});

Then('al consultar la base de datos se observan {string} registros.', async function (numero_registros: number) {
    // Se consulta a la base de datos y se obtiene lo almacenado
    this.registros_almacenados = await this.espaciosFisicosController.obtenerEspaciosFisicos();

    // Se compara si la consulta devuelve los mismos registros que se deseó guardar
    assert.equal(this.registros_almacenados.length, numero_registros);
});

// Borrar datos de la primera prueba
After("@espacios_fisicos_prueba1", async function () {
    // Borrar registro creado en el Dado
    await getRepository(EspacioFisicoEntity).delete({ nombre: this.espacio_fisico_existente.nombre });
    // Borrar registro creado en el Cuando
    await getRepository(EspacioFisicoEntity).delete({ nombre: this.nuevo_espacio_fisico.nombre });

    // Borrar registros creados en el Before
    getRepository(TipoAulaEntity).delete(this.aula);
    getRepository(TipoAulaEntity).delete(this.laboratorio);
    getRepository(FacultadEntity).delete(this.facultad);
    this.aula = undefined;
    this.laboratorio = undefined;
    this.facultad = undefined;
});




/* Se agrega un archivo con múltiples espacios físicos */

Given('que existe un espacio físico llamado BetaPrueba', async function () {
    this.repository = await getRepository(EspacioFisicoEntity);
    this.espacio_fisico_existente1 = new EspacioFisicoDTO("BetaPrueba", this.laboratorio.id, 25);
    await this.repository.save(this.espacio_fisico_existente1);
});
Given('existe un espacio físico llamado AlfaPrueba', async function () {
    this.espacio_fisico_existente2 = new EspacioFisicoDTO("AlfaPrueba", this.laboratorio.id, 25);
    await this.repository.save(this.espacio_fisico_existente2);
});
Given('existe un espacio físico llamado GammaPrueba', async function () {
    this.espacio_fisico_existente3 = new EspacioFisicoDTO("GammaPrueba", this.laboratorio.id, 25);
    await this.repository.save(this.espacio_fisico_existente3);
});
Given('existe un espacio físico llamado SIS502Prueba', async function () {
    this.espacio_fisico_existente4 = new EspacioFisicoDTO("SIS502Prueba", this.aula.id, 25);
    await this.repository.save(this.espacio_fisico_existente4);
});

When('se importe el archivo {string}', async function (nombre_archivo: string) {
    // Se obtiene el archivo
    const direccion = path.join(__dirname, '..', 'documents_test', nombre_archivo);
    this.archivoBuffer = fs.readFileSync(direccion);
    this.archivo = {buffer: this.archivoBuffer};
    
    // Se obtiene una instancia del controlador   
    this.espaciosFisicosController = await this.app.get(EspaciosFisicosController);
    
    this.respuesta = await this.espaciosFisicosController.crearMultiplesEspaciosFisicos(this.archivo);
});

Then('al consultar la base de datos se observan {string} espacios físicos.', async function (numero_registros: number) {
    // Se consulta a la base de datos y se obtiene lo almacenado
    this.registros_almacenados = await this.espaciosFisicosController.obtenerEspaciosFisicos();

    // Numero de filas ingresadas
    assert.equal(this.registros_almacenados.length, numero_registros);
});

// Borrar datos de la segunda prueba
After("@espacios_fisicos_prueba2", async function () {
    // Borrar registros creados en cada Dado
    this.repository.delete({ nombre: this.espacio_fisico_existente1.nombre });
    this.repository.delete({ nombre: this.espacio_fisico_existente2.nombre });
    this.repository.delete({ nombre: this.espacio_fisico_existente3.nombre });
    this.repository.delete({ nombre: this.espacio_fisico_existente4.nombre });

    // Borrar registros creados en el Cuando
    this.respuesta.registros_creados.forEach(registro => {
        this.repository.delete(registro);
    });

    // Borrar registros creados en el Before
    getRepository(TipoAulaEntity).delete(this.aula);
    getRepository(TipoAulaEntity).delete(this.laboratorio);
    getRepository(FacultadEntity).delete(this.facultad);
    this.aula = undefined;
    this.laboratorio = undefined;
    this.facultad = undefined;
});


