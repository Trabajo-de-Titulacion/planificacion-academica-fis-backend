import { SemestreEntity } from "../../src/parametros-iniciales/entities/semestre.entity";
import { AsignaturaEntity } from '../../src/asignatura/entities/asignatura.entity'
import { getRepository } from "typeorm";
import { NumeroEstudiantesPorSemestreDTO } from "../../src/numero_estudiantes/dto/numeroEstudiantesPorSemestre.dto";
import { NumeroEstudiantesPorSemestreController } from "../../src/numero_estudiantes/controllers/numeroEstudiantesPorSemestre.controller";

import { Given, When, Then, After } from '@cucumber/cucumber';
const assert = require('assert');


Given('que existe un semestre cuya planificación está en curso', async function () {
    this.semestre = getRepository(SemestreEntity).create({ abreviatura: '2022-PruebaNumeroEstudiantes'});
    await getRepository(SemestreEntity).save(this.semestre);
});
Given('existen las asignaturas de AsignaturaPrueba1, AsignaturaPrueba2, AsignaturaPrueba3 y AsignaturaPrueba4', async function () {
    this.asignatura1 = await getRepository(AsignaturaEntity).save({
        codigo: 'ASPR111', nombre: 'AsignaturaPrueba1', creditos: 5
    });
    this.asignatura2 = await getRepository(AsignaturaEntity).save({
        codigo: 'ASPR222', nombre: 'AsignaturaPrueba2', creditos: 2
    });
    this.asignatura3 = await getRepository(AsignaturaEntity).save({
        codigo: 'ASPR333', nombre: 'AsignaturaPrueba3', creditos: 3
    });
    this.asignatura4 = await getRepository(AsignaturaEntity).save({
        codigo: 'ASPR444', nombre: 'AsignaturaPrueba4', creditos: 4
    });
});

When('se indica el número de estudiantes {int}, {int}, {int} y {int}, respectivamente,', async function (numEstudiantesAsignatura1: number, numEstudiantesAsignatura2: number, numEstudiantesAsignatura3: number, numEstudiantesAsignatura4: number) {
    this.numeroEstudiantes1 = new NumeroEstudiantesPorSemestreDTO(this.semestre.id, this.asignatura1.id, numEstudiantesAsignatura1);
    this.numeroEstudiantes2 = new NumeroEstudiantesPorSemestreDTO(this.semestre.id, this.asignatura1.id, numEstudiantesAsignatura2);
    this.numeroEstudiantes3 = new NumeroEstudiantesPorSemestreDTO(this.semestre.id, this.asignatura1.id, numEstudiantesAsignatura3);
    this.numeroEstudiantes4 = new NumeroEstudiantesPorSemestreDTO(this.semestre.id, this.asignatura1.id, numEstudiantesAsignatura4);

    this.numeroEstudiantesPorSemestreController = await this.app.get(NumeroEstudiantesPorSemestreController);

    await this.numeroEstudiantesPorSemestreController.registrarNumeroEstudiantesPorSemestre(
        [this.numeroEstudiantes1, this.numeroEstudiantes2, this.numeroEstudiantes3, this.numeroEstudiantes4]
    );
});

Then('al consultar la base de datos de número de estudiantes se observan {int} registros.', async function (numeroRegistros: number) {
    this.registrosAlmacenados = await this.numeroEstudiantesPorSemestreController.obtenerNumeroEstudiantesPorSemestreId(this.semestre.id);

    // Se compara si la consulta devuelve la misma cantidad de registros que se deseó guardar
    assert.equal(this.registrosAlmacenados.length, numeroRegistros);
});

// Borrar datos de la prueba
After("@pruebaNumeroEstudiantes", async function () {
    // Borra el semestre
    await getRepository(SemestreEntity).delete(this.semestre);

    // Borrar las asignaturas
    this.repositorioAsignatura = getRepository(AsignaturaEntity);
    await this.repositorioAsignatura.delete(this.asignatura1);
    await this.repositorioAsignatura.delete(this.asignatura2);
    await this.repositorioAsignatura.delete(this.asignatura3);
    await this.repositorioAsignatura.delete(this.asignatura4);
});