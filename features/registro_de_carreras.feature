# language: es
Característica: Registro de carreras
    Como coordinador deseo registrar la información de la carrera que me 
    sea designada en la facultad, para evitar duplicación de información al 
    momento de registrar otros datos importantes para el proceso de generación 
    de horarios y poder permitir posteriormente la vinculación de materias a
    cada semestre .  

    Esquema del escenario: Ingreso individual de un carrera
	Dado que se tiene una carrera con código "<código_carrera_existente>", nombre "<nombre_carrera_existente>", duración "<duracion_carrera_existente>" y modalidad "<modalidad_carrera_existente>"
	Cuando se ingrese una carrera con código "<código_carrera_nueva>", nombre "<nombre_carrera_nueva>", duración "<duracion_carrera_nueva>" y modalidad "<modalidad_carrera_nueva>"
	Entonces se insertará "<número_carrera_añadidos>" al sistema

    Ejemplos:
	| código_carrera_existente | nombre_carrera_existente | duracion_carrera_existente | modalidad_carrera_existente | código_carrera_nueva | nombre_carrera_nueva     | duracion_carrera_nueva | modalidad_carrera_nueva | número_carrera_añadidos |
	| ICC                      | INGENIERIA EN COMPUTACION| 9                          | PRESENCIAL                  | ISW                  | INGENIERIA EN SOFTWARE   | 9                      | PRESENCIAL              | 1                       |
	| ICC                      | INGENIERIA EN COMPUTACION| 9                          | PRESENCIAL	                 | ICC                  | INGENIERIA EN COMPUTACION| 9                      | PRESENCIAL              | 0                       |	 
