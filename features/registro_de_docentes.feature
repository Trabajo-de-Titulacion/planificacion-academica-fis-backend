			# language: es
			Característica: Registro de docentes
			Como coordinador deseo cargar la información de cada docente a través
			de un archivo o individualmente por un formulario y que se envíe un
			código de acceso temporal aleatorio para asegurar la integridad de
			los datos en el proceso de generación de horarios.

			@Registro_de_docente
			Esquema del escenario: Ingreso individual de un docente
			Dado que se tiene un docente llamado "<nombre_docente_existente>" con el correo electrónico "<correo_electrónico_docente_existente>"
			Cuando se ingrese el docente llamado "<nombre_docente_nuevo>" con el correo electrónico "<correo_electrónico_docente_nuevo>",
			Entonces al leer la base de datos se podrá observar que el código del docente se generó existosamente
			Y se obtendrá una respuesta del envio de correo electrónico "<respuesta_correo>".

			Ejemplos:
			| nombre_docente_existente | correo_electrónico_docente_existente | nombre_docente_nuevo | correo_electrónico_docente_nuevo | respuesta_correo                                                                                                                                        |
			| Juan Jose Gomez Tusa     | diana.lopez03@epn.edu.ec             | Juan Jose Gomez Tusa | diana.lopez03@epn.edu.ec         | El docente JUAN JOSE GOMEZ TUSA ya se encuentra registrado. No se pudo enviar un correo electrónico a diana.lopez03@epn.edu.ec con el código de acceso. |
			| Juan Jose Gomez Tusa     | diana.lopez03@epn.edu.ec             | Maria Ana Gomez      | mahatma.quijano@epn.edu.ec       | Se creó el docente MARIA ANA GOMEZ existosamente. Se envió un correo electrónico a mahatma.quijano@epn.edu.ec con el código de acceso.                  |

			@Registro_de_varios_docentes
			Esquema del escenario: Ingreso por archivo de docentes
			Dado que se tiene un docente llamado "<nombre_docente_existente>" con el correo electrónico "<correo_electrónico_docente_existente>"
			Cuando se ingrese varios docentes por medio de un archivo "<dirección_archivo>"
			Entonces al leer la dase de datos se podrá observar que todos los docentes registrados tienen una clave
			Y se obtendrá una respuesta del envio de correos electrónicos "<respuesta_de_multiples_ingresos>".

			Ejemplos:
			| nombre_docente_existente | correo_electrónico_docente_existente | dirección_archivo                                                                                                                    | respuesta_de_multiples_ingresos                                                                                                                                                                               |
			| Juan José Gómez Tusa     | luis.llanganate@epn.edu.ec           | D:\Proyectos Codigo\TrabajoDeTitulacion\planificacion-academica-fis-backend\features\documents_test\registro_de_docentes_0_fallo.csv | Se han creado exitosamente 2 docentes. Se envió un correo electrónico con el código de acceso a cada uno de los docentes.                                                                                     |
			| Juan José Gómez Tusa     | luis.llanganate@epn.edu.ec           | D:\Proyectos Codigo\TrabajoDeTitulacion\planificacion-academica-fis-backend\features\documents_test\registro_de_docentes_1_fallo.csv | Se han creado exitosamente 2 docentes y se ha enviado un correo electrónico con el código de acceso a cada uno. No se pudo crear a los docentes: PEPE JOSE LUCIO NARANJO, ya que, existen dentro del sistema. |
