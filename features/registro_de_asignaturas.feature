# language: es
Característica: Registro de asignatura
    Como coordinador deseo cargar la información de cada asignatura a través
    de un archivo o individualmente por un formulario para poder ser utilizada 
    dentro del proceso de pre-planificación del semestre entrante siguiendo
    pensum vigente de cada carrera. 

    Esquema del escenario: Ingreso individual de una asignatura
	Dado que se tiene una asignatura con código "<código_asignatura_existente>", nombre "<nombre_asignatura_existente>", cantidad de créditos "<cantidad_de_créditos_asignatura_existente>", código de requisito "<código_de_requisito_existente>" y código de correquisito "<código_de_correquisito_existente>"
	Cuando se ingrese el asignatura con código "<código_asignatura_nueva>", nombre "<nombre_asignatura_nueva>", cantidad de créditos "<cantidad_de_créditos_asignatura_nueva>", código de requisito "<código_de_requisito_nueva>" y código de correquisito "<código_de_correquisito_nueva>",
	Entonces se insertará "<número_asignaturas_añadidas>"  asignaturas al sistema

    Ejemplos:
	| código_asignatura_existente | nombre_asignatura_existente         | cantidad_de_créditos_asignatura_existente | código_de_requisito_existente | código_de_correquisito_existente| código_asignatura_nueva | nombre_asignatura_nueva | cantidad_de_créditos_asignatura_nueva | código_de_requisito_nueva | código_de_correquisito_nueva | número_asignaturas_añadidas |
	| MATD213                     | ECUACIONES DIFERENCIALES ORDINARIAS | 3                                         | MATD113                       |                                 | ICCD1444                | PROGRAMACIÓN I          | 4                                     |                           |                              |                             |
	| MATD113                     | ÁLGEBRA LINEAL                      | 3                                         |                               |                                 | ICCD1444                | PROGRAMACIÓN I          | 4                                     |                           |                              |                             |
    Esquema del escenario: Ingreso por archivo de asignaturas
	Dado que se tiene una asignatura con código "<código_asignatura_existente>", nombre "<nombre_asignatura_existente>", cantidad de créditos "<cantidad_de_créditos_asignatura_existente>", código de requisito "<código_de_requisito_existente>" y código de correquisito "<código_de_correquisito_existente>"
	Cuando se ingrese varios asignaturas por medio de un archivo "<dirección_archivo>"
	Entonces se insertará "<número_asignaturas_añadidas>"  asignaturas al sistema

    Ejemplos:
	| código_asignatura_existente | nombre_asignatura_existente         | cantidad_de_créditos_asignatura_existente | código_de_requisito_existente | código_de_correquisito_existente| dirección_archivo                                                                                                                      | número_asignaturas_añadidas | 
	| MATD213                     | ECUACIONES DIFERENCIALES ORDINARIAS | 3                                         | MATD113                       |                                 |D:\Proyectos Codigo\TrabajoDeTitulacion\planificacion-academica-fis-backend\features\documents_test\registro_de_asignaturas_0_fallo.xlsx| 3                           |
	| MATD213                     | ECUACIONES DIFERENCIALES ORDINARIAS | 3                                         | MATD113                       |                                 |D:\Proyectos Codigo\TrabajoDeTitulacion\planificacion-academica-fis-backend\features\documents_test\registro_de_asignaturas_1_fallo.xlsx| 2                           |