# language: es
Característica: Registro de docentes
    Como coordinador deseo cargar la información de cada docente a través
    de un archivo o individualmente por un formulario y que se envíe un
    código de acceso temporal aleatorio para asegurar la integridad de
    los datos en el proceso de generación de horarios.

    Esquema del escenario: Ingreso individual de un docente
	Dado que se tiene un docente llamado "<nombre_docente_existente>" con el correo electrónico "<correo_electrónico_docente_existente>"
	Cuando se ingrese el docente llamado "<nombre_docente_nuevo>" con el correo electrónico "<correo_electrónico_docente_nuevo>",
	Entonces se insertará "<número_docentes_añadidos>"
	Y se generará un código aleatorio "<código_generado>"

    Ejemplos:
	| nombre_docente_existente | correo_electrónico_docente_existente | nombre_docente_nuevo | correo_electrónico_docente_nuevo | número_docentes_añadidos | código_generado |
	| Juan José Gómez Tusa     | mahatma.quijano@epn.edu.ec           | María Ana Gómez      | diana.lopez03@epn.edu.ec         | 1                        | true            |
	| Juan José Gómez Tusa     | mahatma.quijano@epn.edu.ec           | Juan José Gómez Tusa | mahatma.quijano@epn.edu.ec       | 0                        | false           |

    Esquema del escenario: Ingreso por archivo de docentes
	Dado que se tiene un docente llamado "<nombre_docente_existente>" con el correo electrónico "<correo_electrónico_docente_existente>"
	Cuando se ingrese varios docentes por medio de un archivo "<dirección_archivo>"
	Entonces se insertará "<número_docentes_por_añadir>" 
	Y se generarán códigos aleatorios "<cantidad_de_códigos_generados>"

    Ejemplos:
	| nombre_docente_existente | correo_electrónico_docente_existente | dirección_archivo    														       									                | número_docentes_por_añadir | código_generado |
	| Juan José Gómez Tusa     | mahatma.quijano@epn.edu.ec           |D:\Proyectos Codigo\TrabajoDeTitulacion\planificacion-academica-fis-backend\features\documents_test\registro_de_docentes_0_fallo.xlsx| 2                          | 2               |
	| Juan José Gómez Tusa     | mahatma.quijano@epn.edu.ec           |D:\Proyectos Codigo\TrabajoDeTitulacion\planificacion-academica-fis-backend\features\documents_test\registro_de_docentes_1_fallo.xlsx| 3                          | 2               |
