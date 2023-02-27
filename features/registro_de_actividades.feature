            #language: es

            Característica: Creación de Actividades
            Como coordinador deseo poder registrar una actividad que permita relacionar
            una asignatura, con un grupo de estudiantes, con un docente y una duración
            para que sean tomados en cuenta en la generación de horarios.

            Esquema del escenario: Se registra una actividad con una duración correcta y errónea
                Dado que existe un docente con correo "<correo_docente>",
                Y la carrera "<nombre_carrera>" con código "<codigo_carrera>" con modalidad "presencial",
                Y la asignatura "<nombre_asignatura>" con código "<codigo_asignatura>" de "<num_creditos>" créditos,
                Y un grupo con código "<codigo_subgrupo>" del nivel "<nombre_nivel>" de la carrera previamente mencionada,
                Y un tipo de aula con nombre "<tipo_aula>" en la facultad con nombre "<facultad>",
                Cuando se intenta registrar una actividad indicando un número de estudiantes de "<numero_estudiantes>" y una duración semanal de "<duracion>" horas,
                Y se valida la duración de dicha actividad,
                Entonces se obtiene el mensaje "<mensaje>".

            Ejemplos:
            | correo_docente            | nombre_carrera             | codigo_carrera | nombre_asignatura | codigo_asignatura | num_creditos | codigo_subgrupo | nombre_nivel | tipo_aula   | facultad                           | numero_estudiantes | duracion | mensaje                                                          |
            | bill.gates@epn.edu.ec     | Ingeniería de Software     | ISW            | Programación I    | ISW-1445          | 5            | 1-GR1-SW        | Nivel 1      | laboratorio | Facultad de Ingeniería de Sistemas | 20                 | 7        | La actividad ha sido creada exitosamente                         |
            | darwin.quijano@epn.edu.ec | Ciencias de la Computación | ICC            | Machine Learning  | ICC-1055          | 4            | 2-GR2-CC        | Nivel 2      | regular     | Facultad de Ingeniería de Sistemas | 15                 | 18       | Las duración semanal de la actividad no debe ser mayor a 9 horas |