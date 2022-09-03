# language: es
Característica: Registro de espacios físicos
    Como gestor de espacios físicos deseo registrar las diferentes aulas y laboratorios, ya sea de forma
    masiva a partir de un archivo o individualmente a través de un formulario, para distribuir los cursos
    de manera adecuada así evitando problemas por falta de infraestructura y evitar aglomeraciones.

    @espaciosFisicosPruebaCrearUnEspacioFisico
    Esquema del escenario: Se agrega un espacio físico
        Dado que existe un espacio fisico llamado "<nombre>"
        Cuando se agrega un espacio fisico llamado "<nuevoEspacioFisico>"
        Entonces al consultar la base de datos se observan "<numeroRegistros>" registros.

    Ejemplos:
        | nombre            | nuevoEspacioFisico          | numeroRegistros  |
        | BetaPrueba        | AlfaPrueba                  | 2                 |
        | BetaPrueba        | BetaPrueba                  | 1                 |


    @espaciosFisicosPruebaCrearMultiplesEspaciosFisicos
    Esquema del escenario: Se agrega un archivo con múltiples espacios físicos
        Dado que existe un espacio físico llamado BetaPrueba
        Y existe un espacio físico llamado AlfaPrueba
        Y existe un espacio físico llamado GammaPrueba
        Y existe un espacio físico llamado SIS502Prueba
        Cuando se importe el archivo "<nombreArchivo>"
        Entonces al consultar la base de datos se observan "<numeroRegistros>" espacios físicos.
    
    Ejemplos:
        | nombreArchivo                        | numeroRegistros  |
        # Archivo con 5 espacios fisicos y 0 duplicados
        | espacios_fisicos_prueba1.csv          |  9                |
        # Archivo con 5 espacios fisicos y 2 duplicados
        | espacios_fisicos_prueba2.csv          | 7                 |