# language: es
Característica: Registro de horas no disponibles del docente
    Como docente deseo señalar en una matriz mis horas no disponibles por
    cada día de la semana para que el horario del periodo subsecuente que
    me sea asignado pueda acoplarse a mis actividades académicas, de
    docencia y de investigación.

    @horas_no_disponibles_prueba1
    Escenario: Se agregan horas no disponibles de un docente
        Dado que existe un docente con id 5a5z4a6s5
        Cuando se agregan como horas no disponibles el día Martes de 14 a 15
        Y el día Martes de 15 a 16
        Y también el día Jueves de 7 a 8
        Entonces se obtienen 3 filas alteradas en la base de datos