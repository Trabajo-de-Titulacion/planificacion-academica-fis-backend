# language: es
Característica: Visualización de horarios
Como coordinador y subdecano quiero visualizar los horarios generados
por semestre (de cada carrera) y docente para facilitar el proceso de
revisión previo a la validación/carga en el sistema SAEW.

@VisualizacionFiltroDocente
Escenario: Visualización de horarios usando filtro por docente
Dado que se tiene un archivo tipo JSON con el horario generado previamente llamado visualizacion_horario_prueba
Cuando se seleccione un filtro por el docente Martínez Mosquera Silvia Diana
Entonces se obtendrá las asignaturas, semestres y horas del docente seleccionado respuesta_horario_docente.

@VisualizacionFiltroCarrera
Escenario: Visualización de horarios usando filtro por carrera
Dado que se tiene un archivo tipo JSON con el horario generado previamente llamado visualizacion_horario_prueba
Cuando se seleccione un filtro por semestre de una carrera y grupo 6-GR1-ICC
Entonces se obtendrá las asignaturas, docente y horas del filtro seleccionado respuesta_horario_carrera.