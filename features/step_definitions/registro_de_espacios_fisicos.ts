import { EspacioFisicoDTO } from "../../src/espacios_fisicos/dto"
import { EspacioFisico } from "../../src/espacios_fisicos/entities/espacio_fisico.entity"
import { EspaciosFisicosController } from "../../src/espacios_fisicos/espacios_fisicos.controller";
import * as fs from 'fs';
const path = require('path')

import { Given, When, Then, After } from "@cucumber/cucumber"
import { getRepository } from "typeorm";
const assert = require('assert');


/* Se agrega un espacio físico */

Given('que existe un espacio fisico llamado {string}', async function (nombre_espacio_fisico: string) {
    this.espacio_fisico_existente = new EspacioFisicoDTO(nombre_espacio_fisico, "laboratorio", 25);
    await getRepository(EspacioFisico).save(this.espacio_fisico_existente);
});

When('se agrega un espacio fisico llamado {string}', async function (nombre_espacio_fisico: string) {
    this.espaciosFisicosController = await this.app.get(EspaciosFisicosController);

    this.nuevo_espacio_fisico = new EspacioFisicoDTO(nombre_espacio_fisico, "laboratorio", 25);
    
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
    await getRepository(EspacioFisico).delete(this.espacio_fisico_existente);
    // Borrar registro creado en el Cuando
    await getRepository(EspacioFisico).delete(this.nuevo_espacio_fisico);
});



/* Se agrega un archivo con múltiples espacios físicos */

Given('que existe un espacio físico llamado BetaPrueba', async function () {
    this.repository = await getRepository(EspacioFisico);
    this.espacio_fisico_existente1 = new EspacioFisicoDTO("BetaPrueba", "laboratorio", 25);
    await this.repository.save(this.espacio_fisico_existente1);
});
Given('existe un espacio físico llamado AlfaPrueba', async function () {
    this.espacio_fisico_existente2 = new EspacioFisicoDTO("AlfaPrueba", "laboratorio", 25);
    await this.repository.save(this.espacio_fisico_existente2);
});
Given('existe un espacio físico llamado GammaPrueba', async function () {
    this.espacio_fisico_existente3 = new EspacioFisicoDTO("GammaPrueba", "laboratorio", 25);
    await this.repository.save(this.espacio_fisico_existente3);
});
Given('existe un espacio físico llamado SIS502Prueba', async function () {
    this.espacio_fisico_existente4 = new EspacioFisicoDTO("SIS502Prueba", "aula", 25);
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
    this.repository.delete(this.espacio_fisico_existente1);
    this.repository.delete(this.espacio_fisico_existente2);
    this.repository.delete(this.espacio_fisico_existente3);
    this.repository.delete(this.espacio_fisico_existente4);

    // Borrar registros creados en el Cuando
    this.respuesta.registros_creados.forEach(registro => {
        this.repository.delete(registro);
    });
});


