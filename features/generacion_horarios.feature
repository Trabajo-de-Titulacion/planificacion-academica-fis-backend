#language: es

Característica: Generación de horarios con el software FET
El sistema necesita enviar los datos de entrada al software FET en un
formato de etiquetas con extensión .fet para obtener como salida los
horarios de cada nivel académico.

Escenario: Se genera los horarios con el motor del software FET
    Dado el archivo de planificación "HorariosFIS_2022B_v45_horarios.fet",
    Cuando se reutilice el motor del software FET desde la API,
    Entonces se obtendrán los horarios por subgrupo generados en etiquetas XML.

