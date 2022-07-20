# language: es
Característica: Registro de docentes
    Como coordinador deseo cargar la información de cada docente a través
    de un archivo o individualmente por un formulario y que se envíe un
    código de acceso temporal aleatorio para asegurar la integridad de
    los datos en el proceso de generación de horarios.

    Esquema del escenario: Ingreso individual de un docente
	Dado que se tiene un docente llamado "<nombre_docente_existente>" con el correo electrónico "<correo_electrónico_docente_existente>"
	Cuando se ingrese el docente llamado "<nombre_docente_nuevo>" con el correo electrónico "<correo_electrónico_docente_nuevo>",
	Entonces se registrará el código del docente "<se_registro_codigo>"
	Y se obtendrá una respuesta del envió de correo electrónico "<respuesta_correo>"

    Ejemplos:
	| nombre_docente_existente | correo_electrónico_docente_existente | nombre_docente_nuevo | correo_electrónico_docente_nuevo | se_registro_codigo | respuesta_correo             |
	| Juan José Gómez Tusa     | diana.lopez03@epn.edu.ec             | Juan José Gómez Tusa | diana.lopez03@epn.edu.ec         | false              | Correo electrónico no enviado|
	| Juan José Gómez Tusa     | diana.lopez03@epn.edu.ec             | María Ana Gómez      | mahatma.quijano@epn.edu.ec       | true               | Correo electrónico enviado   |

    Esquema del escenario: Ingreso por archivo de docentes
	Dado que se tiene un docente llamado "<nombre_docente_existente>" con el correo electrónico "<correo_electrónico_docente_existente>"
	Cuando se ingrese varios docentes por medio de un archivo "<dirección_archivo>"
	Entonces se registrara "<cantidad_de_códigos_ generados>" de códigos de los docentes
	Y se obtendrá una respuesta del envió de correos electrónicos "<respuesta_de_multiples_ingresos>"

    Ejemplos:
	| nombre_docente_existente | correo_electrónico_docente_existente | dirección_archivo 														       									                   | cantidad_de_códigos_generados | respuesta_de_multiples_ingresos          	 |
	| Juan José Gómez Tusa     | diana.lopez03@epn.edu.ec             |D:\Proyectos Codigo\TrabajoDeTitulacion\planificacion-academica-fis-backend\features\documents_test\registro_de_docentes_0_fallo.csv| 2                             | Correos electrónicos enviados               |
	| Juan José Gómez Tusa     | diana.lopez03@epn.edu.ec             |D:\Proyectos Codigo\TrabajoDeTitulacion\planificacion-academica-fis-backend\features\documents_test\registro_de_docentes_3_fallo.csv| 0                             | Existen correos electrónicos no enviados    |
  