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
	Entonces se obtendrá la respuesta "<respuesta_ingreso_carrera>" del sistema

    Ejemplos:
	| código_carrera_existente | nombre_carrera_existente | duracion_carrera_existente | modalidad_carrera_existente | código_carrera_nueva | nombre_carrera_nueva     | duracion_carrera_nueva | modalidad_carrera_nueva | respuesta_ingreso_carrera                                        |
	| Icc                      | Ingenieria en computacion| 9                          | Presencial                  | Isw                  | Ingenieria en software   | 9                      | Presencial                  | Se ha creado existosamente la carrera de INGENIERIA EN SOFTWARE. |
	| Isw                      | Ingenieria en software   | 9                          | Presencial                  | Isw                  | Ingenieria en software   | 9                      | Presencial                  | La carrera INGENIERIA EN SOFTWARE ya se encuentra registrada.    | 	 
