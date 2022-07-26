#language: es

Característica: Parámetros iniciales
    Como coordinador deseo establecer los parámetros iniciales de la planificación 
    semestral como por ejemplo el semestre en curso, los días hábiles laborables y 
    su horario en intervalos de horas del día, los nombres y nomenclatura de los edificios
    y  tipos de aulas, para que posteriormente al generar los horarios estos cumplan
    con las restricciones iniciales y se evite obtener horarios no aplicables en la modalidad
    de trabajo de la institución.  

    Esquema del escenario: Aquel en el que se establece el horario laboral de la institución
        Dado el semestre en curso "<semestre>",
        Cuando se registre el horario laboral del día "<dia_laboral>" de "<hora_inicio>" a "<hora_fin>",
        Entonces se obtienen un número de 15 horas en dicho día laboral
    
    Ejemplos:
        | semestre  | dia_laboral | hora_inicio | hora_fin | numero_horas_laborales |
        | 2022-A    | LUNES  | 07:00 | 22:00 | 15 |

    Esquema del escenario: Aquel en el que se registra un laboratorio de una facultad con el formato institucional
        Dado el edificio número 12 correspondiente a la Facultad de Ingeniería de Sistemas,
        Cuando se desea registrar el laboratorio GAMMA en dicho edificio,
        Entonces está deberá registrarse con el formato 12-Af.