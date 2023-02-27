#language: es

Característica: Generación de horarios con el software FET
    El sistema necesita enviar los datos de entrada al software FET en un
    formato de etiquetas con extensión .fet para obtener como salida los
    horarios de cada nivel académico.


    Escenario: Se genera un archivo ".fet" con los datos del sistema
        Dado los datos de entrada actuales del sistema,
        Y el semestre de planifiación en curso "2022-A",
        Cuando se recopila los datos en el formato del SOFTWARE FET,
        Entonces se obtiene un archivo de etiquetas con extensión ".fet".

    Escenario: Se genera los horarios con el motor del software FET
        Dado que se tiene un archivo ".fet" con datos de entrada,
        Y el semestre de planificación en curso "2022-A"
        Cuando se ejecute desde el sistema el comando del software FET,
        Y pasando como parámetro el archivo ".fet",
        Entonces se tendrá un archivo en formato JSON con los horarios generados.

