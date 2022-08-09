# language: es
Característica: Registro de asignatura
    Como coordinador deseo cargar la información de cada asignatura a través
    de un archivo o individualmente por un formulario para poder ser utilizada 
    dentro del proceso de pre-planificación del semestre entrante siguiendo
    pensum vigente de cada carrera. 

    Esquema del escenario: Ingreso individual de una asignatura
	Dado que se tiene una asignatura con código "<código_asignatura_existente>", nombre "<nombre_asignatura_existente>", cantidad de créditos "<cantidad_de_créditos_asignatura_existente>", código de requisito "<código_de_requisito_existente>" y código de correquisito "<código_de_correquisito_existente>"
	Cuando se ingrese el asignatura con código "<código_asignatura_nueva>", nombre "<nombre_asignatura_nueva>", cantidad de créditos "<cantidad_de_créditos_asignatura_nueva>", código de requisito "<código_de_requisito_nueva>" y código de correquisito "<código_de_correquisito_nueva>",
	Entonces se obtendrá la respuesta "<respuesta_ingreso_asignatura>" del sistema

    Ejemplos:
	| código_asignatura_existente | nombre_asignatura_existente         | cantidad_de_créditos_asignatura_existente | código_de_requisito_existente | código_de_correquisito_existente| código_asignatura_nueva | nombre_asignatura_nueva             | cantidad_de_créditos_asignatura_nueva | código_de_requisito_nueva | código_de_correquisito_nueva | respuesta_ingreso_asignatura                                                 |
	| MATD113                     | Algebra lineal                      | 3                                         |                               |                                 | ICCD1444                | Programacion I                      | 4                                     |                           |                              |  Se ha creado existosamente la asignatura PROGRAMACION I.                    |
	| MATD213                     | Ecuaciones diferenciales ordinarias | 3                                         | MATD113                       |                                 | MATD213                 | Ecuaciones diferenciales ordinarias | 4                                     |                           |                              | La asignatura ECUACIONES DIFERENCIALES ORDINARIAS ya se encuentra registrada.|

    Esquema del escenario: Ingreso por archivo de asignaturas
	Dado que se tiene una asignatura con código "<código_asignatura_existente>", nombre "<nombre_asignatura_existente>", cantidad de créditos "<cantidad_de_créditos_asignatura_existente>", código de requisito "<código_de_requisito_existente>" y código de correquisito "<código_de_correquisito_existente>"
	Cuando se ingrese varios asignaturas por medio de un archivo "<dirección_archivo>"
	Entonces se obtendrá la respuesta "<respuesta_de_multiples_ingresos_asignaturas>" 

    Ejemplos:
	| código_asignatura_existente | nombre_asignatura_existente         | cantidad_de_créditos_asignatura_existente | código_de_requisito_existente | código_de_correquisito_existente| dirección_archivo                                                                                                                     | respuesta_de_multiples_ingresos_asignaturas                                                                          | 
	| MATD213                     | Ecuaciones diferenciales ordinarias | 3                                         | MATD113                       |                                 |D:\Proyectos Codigo\TrabajoDeTitulacion\planificacion-academica-fis-backend\features\documents_test\registro_de_asignaturas_0_fallo.csv| Se han creado exitosamente 3 asignaturas.                                                                |
	| MATD213                     | Ecuaciones diferenciales ordinarias | 3                                         | MATD113                       |                                 |D:\Proyectos Codigo\TrabajoDeTitulacion\planificacion-academica-fis-backend\features\documents_test\registro_de_asignaturas_1_fallo.csv| Se han creado exitosamente 2 asignaturas. No se pudo crear 1 docente/es, ya que existen en el sistema.|