			# language: es
			Característica: Registro de docentes
			Como coordinador deseo cargar la información de cada docente a través
			de un archivo o individualmente por un formulario y que se envíe una
			clave de acceso temporal aleatorio para asegurar la integridad de
			los datos en el proceso de generación de horarios.

			@RegistroDeDocente
			Esquema del escenario: Ingreso individual de un docente
			Dado que se tiene un docente llamado "<nombreDocenteExistente>" con el correo electrónico "<correoElectrónicoDocenteExistente>"
			Cuando se ingrese el docente llamado "<nombreDocenteNuevo>" con el correo electrónico "<correoElectrónicoDocenteNuevo>"
			Entonces al leer la base de datos se podrá observar que la clave del docente se generó existosamente
			Y se obtendrá una respuesta del envío de correo electrónico "<respuestaCorreo>".

			Ejemplos:
			| nombreDocenteExistente | correoElectrónicoDocenteExistente | nombreDocenteNuevo   | correoElectrónicoDocenteNuevo | respuestaCorreo                                                                                                                                        |
			| Juan Jose Gomez Tusa   | diana.lopez03@epn.edu.ec          | Juan Jose Gomez Tusa | diana.lopez03@epn.edu.ec      | El docente JUAN JOSE GOMEZ TUSA ya se encuentra registrado. No se pudo enviar un correo electrónico a diana.lopez03@epn.edu.ec con la clave de acceso. |
			| Juan Jose Gomez Tusa   | diana.lopez03@epn.edu.ec          | Maria Ana Gomez      | mahatma.quijano@epn.edu.ec    | Se creó el docente MARIA ANA GOMEZ existosamente. Se envió un correo electrónico a mahatma.quijano@epn.edu.ec con la clave de acceso.                  |

			@RegistroDeVariosDocentes
			Esquema del escenario: Ingreso por archivo de docentes
			Dado que se tiene un docente llamado "<nombreDocenteExistente>" con el correo electrónico "<correoElectrónicoDocenteExistente>"
			Cuando se ingrese varios docentes por medio de un archivo csv "<direcciónArchivo>"
			Entonces al leer la base de datos se podrá observar que todos los docentes registrados tienen una clave
			Y se obtendrá una respuesta del envío de correos electrónicos "<respuestaDeMultiplesIngresos>".

			Ejemplos:
			| nombreDocenteExistente | correoElectrónicoDocenteExistente | direcciónArchivo                 | respuestaDeMultiplesIngresos                                                                                                                                                                                 |
			| Juan José Gómez Tusa   | luis.llanganate@epn.edu.ec        | registro_de_docentes_0_fallo.csv | Se han creado exitosamente 2 docentes. Se envió un correo electrónico con la clave de acceso a cada uno de los docentes.                                                                                     |
			| Juan José Gómez Tusa   | luis.llanganate@epn.edu.ec        | registro_de_docentes_1_fallo.csv | Se han creado exitosamente 2 docentes y se ha enviado un correo electrónico con la clave de acceso a cada uno. No se pudo crear a los docentes: PEPE JOSE LUCIO NARANJO, ya que, existen dentro del sistema. |
