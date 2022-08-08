#language: es

Característica: Parámetros iniciales
    Como coordinador deseo establecer los parámetros iniciales de la planificación 
    semestral como por ejemplo el semestre en curso, los días hábiles laborables y 
    su horario en intervalos de horas del día, los nombres y nomenclatura de los edificios
    y  tipos de aulas, para que posteriormente al generar los horarios estos cumplan
    con las restricciones iniciales y se evite obtener horarios no aplicables en la modalidad
    de trabajo de la institución.  

    @parametros_iniciales_escenario1
    Escenario: Aquel en el que se establece el horario laboral de la institución
        Dado el semestre en curso '2022-A',
        Cuando se registre el día laboral "LUNES" en el horario de "07:00" a "21:00" horas con hora de almuerzo a las "13:00",
        Entonces se obtienen 13 horas laborales e intervalos de una hora.

    Esquema del escenario: Aquel en el que se registra los tipos de aula de la FIS
        Dado que existe la facultad con nombre "FACULTAD DE INGENIERÍA DE SISTEMAS",
        Cuando se registre el tipo de aula "AULA REGULAR",
        Y el tipo de aula "LABORATORIO"
        Entonces al consultar la base de datos se observan 2 registros.