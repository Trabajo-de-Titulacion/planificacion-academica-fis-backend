# language: es
Característica: Registro de alumnos por asignatura
    Como coordinador deseo ingresar a través de un formulario el número de estudiantes que cursarán cada una
    de las asignaturas del semestre actual, para poder planificar los horarios en base a los cupos que deberán
    estar disponibles para las asignaturas de dicho semestre.

    @pruebaNumeroEstudiantes
    Escenario: Se indica el número de estudiantes de un semestre en curso
        Dado que existe un semestre cuya planificación está en curso
        Y existen las asignaturas de AsignaturaPrueba1, AsignaturaPrueba2, AsignaturaPrueba3 y AsignaturaPrueba4
        Cuando se indica el número de estudiantes 27, 10, 40 y 5, respectivamente,
        Entonces al consultar la base de datos de número de estudiantes se observan 4 registros.