#language: es

Característica: Parámetros iniciales
    Como coordinador deseo establecer los parámetros iniciales de la planificación 
    semestral como por ejemplo el semestre en curso, los días hábiles laborables y 
    su horario en intervalos de horas del día, los nombres y nomenclatura de los edificios
    y  tipos de aulas, para que posteriormente al generar los horarios estos cumplan
    con las restricciones iniciales y se evite obtener horarios no aplicables en la modalidad
    de trabajo de la institución.  

    Escenario: Aquel en el que se establece el horario laboral de la institución
        Dado el semestre en curso 2022-A,
        Y que existe los días laborales de lunes a sábado,
        Cuando se registre el horario laboral con hora de inicio 07:00 a hora de fin 10:00,
        Y la hora de inicio de almuerzo 13:00,
        Entonces se obtienen un número de 14 horas en cada día laboral y 14 intervalos.

    Esquema del escenario: Aquel en el que se registra un laboratorio de una facultad con el formato institucional
        Dado el edificio número 12 correspondiente a la Facultad de Ingeniería de Sistemas,
        Cuando se desea registrar el laboratorio GAMMA en dicho edificio,
        Entonces está deberá registrarse con el formato 12-Af.