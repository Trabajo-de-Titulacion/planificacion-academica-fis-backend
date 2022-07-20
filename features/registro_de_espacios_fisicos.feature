# language: es
Característica: Registro de espacios físicos
    Como gestor de espacios físicos deseo registrar las diferentes aulas y laboratorios con su disponibilidad,
    ya sea de forma masiva a partir de un archivo o individualmente a través de un formulario, para distribuir
    los cursos de manera adecuada así evitando problemas por falta de infraestructura y evitar aglomeraciones.

    @espacios_fisicos_prueba1
    Esquema del escenario: Se agrega un espacio físico
        Dado que existe un espacio fisico llamado "<nombre>"
        Cuando se agrega un espacio fisico llamado "<nuevo_espacio_fisico>"
        Entonces se inserta "<filas_alteradas>" en la base de datos

    Ejemplos:
        | nombre            | nuevo_espacio_fisico          | filas_alteradas   |
        | BetaPrueba        | AlfaPrueba                    | 1                 |
        | BetaPrueba        | BetaPrueba                    | 0                 |


    @espacios_fisicos_prueba2
    Esquema del escenario: Se agrega un archivo con múltiples espacios físicos
        Dado que existe un espacio físico llamado BetaPrueba
        Y existe un espacio físico llamado AlfaPrueba
        Y existe un espacio físico llamado GammaPrueba
        Y existe un espacio físico llamado SIS502Prueba
        Cuando se importe el archivo "<dirección_archivo>"
        Entonces se insertan "<filas_alteradas>" en la base de datos
    
    Ejemplos:
        | dirección_archivo                                         | filas_alteradas   |
        # Archivo con 5 espacios fisicos y 0 duplicados
        | C:\Users\mahis\Desktop\espacios_fisicos_prueba1.csv       | 5                 |
        # Archivo con 5 espacios fisicos y 2 duplicados
        | C:\Users\mahis\Desktop\espacios_fisicos_prueba2.csv       | 3                 |