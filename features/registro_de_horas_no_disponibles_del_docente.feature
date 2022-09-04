# language: es
Característica: Registro de horas no disponibles del docente
    Como docente deseo solicitar al jefe de departamento la consideración de mis horas no disponibles,
    seleccionadas en una matriz, por cada día de la semana para que el horario del periodo subsecuente
    que me sea asignado pueda acoplarse a mis actividades académicas, de docencia y de investigación.

    @horasNoDisponiblesPruebaHorasAprobadas
    Escenario: Se aprueba la solicitud horas no disponibles de un docente
        Dado que existe un docente con correo mahatma.quijano@epn.edu.ec
        Y un semestre con jornada laboral de lunes a sábado desde las 7h hasta las 20h con almuerzo a las 13h
        Cuando se solicitan como horas no disponibles el día Martes de 14 a 15
        Y el día Martes de 15 a 16
        Y también el día Jueves de 7 a 8
        Y el jefe de departamento aprueba la solicitud
        Entonces al consultar la base de datos de horas no disponibles se observan 3 registros
        Y el docente recibe un correo electrónico indicando la aprobación de su solicitud.

    @horasNoDisponiblesPruebaHorasRechazadas
    Escenario: Se rechaza la solicitud horas no disponibles de un docente
        Dado que existe un docente con correo mahatma.quijano@epn.edu.ec
        Y un semestre con jornada laboral de lunes a sábado desde las 7h hasta las 20h con almuerzo a las 13h
        Cuando se solicitan como horas no disponibles el día Martes de 14 a 15
        Y el día Martes de 15 a 16
        Y también el día Jueves de 7 a 8
        Y el jefe de departamento rechaza la solicitud
        Entonces al consultar la base de datos de horas no disponibles se observan 0 registros
        Y el docente recibe un correo electrónico indicando el rechazo de su solicitud.

# Versión del sprint 1
# Como docente deseo señalar en una matriz mis horas no disponibles por
# cada día de la semana para que el horario del periodo subsecuente que
# me sea asignado pueda acoplarse a mis actividades académicas, de
# docencia y de investigación.