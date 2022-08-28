#language: es

Característica: Actividades
    Como coordinador deseo poder crear una actividad antes de generar el horario 
    seleccionando un profesor, la asignatura, aulas y sus restriciones para definir 
    los horarios por nivel.

    Esquema del escenario: Se registra una actividad
	Dado que existe un docente con correo <correo_docente>
    Y la asignatura con código <codigo_asignatura>
    Y un subgrupo con código <codigo_subgrupo>
    Y un tipo de aula con nombre <tipo_aula> en la facultad con nombre <facultad>
    Cuando se registre una actividad indicando un número de estudiantes de <número_estudiantes>
    Entonces al consultar la base de datos de actividades se observan <numero_registros> registros.
    
    Ejemplos:
	| correo_docente             | codigo_asignatura | codigo_subgrupo | tipo_aula   | facultad                           | número_estudiantes | numero_registros |
	| luis.llanganate@epn.edu.ec | ISW-1445          | 1-GR1-SW        | laboratorio | Facultad de Ingeniería de Sistemas | 20                 | 1                |
	| mahatma.quijano@epn.edu.ec | ICC-1055          | 2-GR2-CC        | regular     | Facultad de Ingeniería de Sistemas | 15                 | 2                |