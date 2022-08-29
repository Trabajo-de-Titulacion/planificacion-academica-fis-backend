const assert = require('assert');
import { Given, When, Then, After } from '@cucumber/cucumber';
import { getRepository } from 'typeorm';
import { HorarioController } from '../../src/horario/controllers/horario.controller';
import { HorarioEntity } from '../../src/horario/entities/horario.entity';
import * as fs from 'fs';

const path = require('path');

/* ESCENARIO 1 - Visualización de horarios usando filtro por docente */

Given('que se tiene un archivo tipo JSON con el horario generado previamente llamado visualizacion_horario_prueba', { timeout: 5 * 5000 }, async function () {
    /*
    Los datos recibidos son:
    |         Significado               | Nombre variable           | Tipo de dato necesario |
    |   Nombre del archivo              | nombreArchivo             | string                 |
    */

    this.nombreArchivo = "visualizacion_horario_prueba.json";

    // Generar el horario a ingresar
    this.horarioController = await this.app.get(HorarioController);

    const pathArchivo = path.join(__dirname, "..", "documents_test", this.nombreArchivo);
    this.lecturaArchivo = fs.readFileSync(pathArchivo);

    // Crear el objeto en la base de datos
    var today = new Date();
    // Obtener la fecha y la hora
    this.fechaHoraActual = today.toLocaleString();

    this.horarioGenerado = {
        fechaCreacion: this.fechaHoraActual,
        horarioJson: this.lecturaArchivo
    }

    this.horarioGenerado = await getRepository(HorarioEntity).save(this.horarioGenerado);
});

When('se seleccione un filtro por el docente Martínez Mosquera Silvia Diana', { timeout: 5 * 5000 }, async function () {
    /*
    Los datos recibidos son:
    |         Significado               | Nombre variable           | Tipo de dato necesario |
    |   Nombre del docente seleccionado | nombreDocente             | string                 |
    */

    // Selección del docente
    this.nombreDocente = "Martínez Mosquera Silvia Diana";

    // Llamar al método de filtrado
    this.resultadoObtenido = await this.horarioController.obtenerHorarioDocente(this.nombreDocente, this.horarioGenerado.id);
});

Then('se obtendrá las asignaturas, semestres y horas del docente seleccionado respuesta_horario_docente.', { timeout: 5 * 5000 }, async function () {

    // Leer archivo
    this.nombreArchivoLeer = "respuesta_horario_docente.json";

    const pathArchivo = path.join(__dirname, "..", "documents_test", this.nombreArchivoLeer);
    this.lecturaArchivoRespuesta = fs.readFileSync(pathArchivo);
    assert.deepEqual(this.resultadoObtenido, JSON.parse(this.lecturaArchivoRespuesta));
});

After("@VisualizacionFiltroDocente", async function () {
    //Eliminar datos usados
    await getRepository(HorarioEntity).delete(this.horarioGenerado);
});

/* ESCENARIO 2 - Visualización de horarios usando filtro por carrera */

When('se seleccione un filtro por semestre de una carrera y grupo 6-GR1-ICC', { timeout: 5 * 5000 }, async function () {
    /*
    Los datos recibidos son:
    |         Significado                   | Nombre variable              | Tipo de dato necesario |
    |   Filtro de semestre, carrera y grupo | filtroSemestreCarreraGrupo   | string                 |
    */

    // Selesccionar filtro
    this.filtroSemestreCarreraGrupo = "6-GR1-ICC";

    // Llamar al método de filtrado
    this.resultadoObtenidoFiltro = await this.horarioController.obtenerHorarioGrupo(this.filtroSemestreCarreraGrupo, this.horarioGenerado.id);
});

Then('se obtendrá las asignaturas, docente y horas del filtro seleccionado respuesta_horario_carrera.', { timeout: 5 * 5000 }, async function () {
    /*
    Los datos recibidos son:
    |              Significado         | Nombre variable           | Tipo de dato necesario |
    | Respuesta de horario filtrado    | nombreArchivoLeerFiltro   | string                 |
    */

    // Leer archivo
    this.nombreArchivoLeerFiltro = "respuesta_horario_carrera.json";

    const pathArchivoFiltro = path.join(__dirname, "..", "documents_test", this.nombreArchivoLeerFiltro);
    this.lecturaArchivoRespuestaFiltro = fs.readFileSync(pathArchivoFiltro);
    assert.deepEqual(this.resultadoObtenidoFiltro, JSON.parse(this.lecturaArchivoRespuestaFiltro));
});

After("@VisualizacionFiltroCarrera", async function () {
    //Eliminar datos usados
    await getRepository(HorarioEntity).delete(this.horarioGenerado);
});