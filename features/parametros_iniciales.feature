#language: es

Característica: Parámetros iniciales
    Como coordinador deseo establecer los parámetros iniciales de la planificación
    semestral como por ejemplo el semestre en curso, los días hábiles laborables y
    su horario en intervalos de horas del día, el nombre de la facultad y sus tipos
    de aulas, para que posteriormente al generar los horarios estos cumplan con las
    restricciones iniciales y se evite obtener horarios no aplicables en la modalidad
    de trabajo de la institución.

    Escenario: Se establece el horario laboral de la institución
        Dado el semestre '2022-A' con estado "PLANIFICACION_EN_PROGRESO",
        Cuando se registre el día laboral "LUNES" en el horario de "07:00" a "21:00" horas con hora de almuerzo a las "13:00",
        Entonces se obtienen 13 horas laborales e intervalos de una hora.

    Escenario: Se registran tipos de aulas para diferentes unidades académicas
        Dado que existe la unidad académica "FACULTAD DE INGENIERÍA DE SISTEMAS",
        Y otra unidad académica con nombre "FORMACIÓN BÁSICA"
        Cuando se registre el tipo de aula "LABORATORIO" para la primera unidad,
        Y el tipo de aula "AULA REGULAR" para la segunda unidad académica,
        Entonces la segunda unidad acedémica dispone de 0 laboratorios.
