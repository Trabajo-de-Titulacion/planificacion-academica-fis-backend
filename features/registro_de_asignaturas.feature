			# language: es
			Característica: Registro de asignatura
			Como coordinador deseo cargar la información de cada asignatura a través
			de un archivo o individualmente por un formulario para para asegurar la
			integridad de los datos en el proceso de generación de horarios.

			@RegistroDeAsignatura
			Esquema del escenario: Ingreso individual de una asignatura
			Dado que se tiene una asignatura con el código "<códigoAsignaturaExistente>", nombre "<nombreAsignaturaExistente>" y cantidad de créditos "<cantidadDeCréditosAsignaturaExistente>"
			Cuando se ingrese el asignatura con código "<códigoAsignaturaNueva>", nombre "<nombreAsignaturaNueva>" y cantidad de créditos "<cantidadDeCréditosAsignaturaNueva>"
			Entonces se obtendrá una respuesta del registro individual "<respuestaIngresoAsignaturaIndividual>".

			Ejemplos:
			| códigoAsignaturaExistente | nombreAsignaturaExistente           | cantidadDeCréditosAsignaturaExistente | códigoAsignaturaNueva | nombreAsignaturaNueva               | cantidadDeCréditosAsignaturaNueva | respuestaIngresoAsignaturaIndividual                                                    |
			| MATD113                   | Algebra lineal                      | 3                                     | ICCD1444              | Programacion I                      | 4                                 | Se creó la asignatura ICCD1444 - PROGRAMACION I existosamente.                          |
			| MATD213                   | Ecuaciones diferenciales ordinarias | 3                                     | MATD213               | Ecuaciones diferenciales ordinarias | 4                                 | La asignatura MATD213 - ECUACIONES DIFERENCIALES ORDINARIAS ya se encuentra registrada. |

			@RegistroDeVariasAsignaturas
			Esquema del escenario: Ingreso por archivo de asignaturas
			Dado que se tiene una asignatura con el código "<códigoAsignaturaExistente>", nombre "<nombreAsignaturaExistente>" y cantidad de créditos "<cantidadDeCréditosAsignaturaExistente>"
			Cuando se ingrese varias asignaturas por medio de un archivo csv "<nombreArchivo>"
			Entonces se obtendrá una respuesta del registro múltiple "<respuestaDeMultiplesIngresosAsignaturas>".

			Ejemplos:
			| códigoAsignaturaExistente | nombreAsignaturaExistente           | cantidadDeCréditosAsignaturaExistente | nombreArchivo                       | respuestaDeMultiplesIngresosAsignaturas                                                                                                                           |
			| MATD213                   | Ecuaciones diferenciales ordinarias | 3                                     | registro_de_asignaturas_0_fallo.csv | Se han creado exitosamente 4 asignaturas.                                                                                                                         |
			| MATD213                   | Ecuaciones diferenciales ordinarias | 3                                     | registro_de_asignaturas_1_fallo.csv | Se han creado exitosamente 4 asignaturas.  No se pudo crear la/s asignatura/s: MATD213 - ECUACIONES DIFERENCIALES ORDINARIAS, ya que, existen dentro del sistema. |