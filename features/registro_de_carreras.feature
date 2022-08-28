            # language: es
            Característica: Registro de carreras
            Como coordinador deseo registrar la información de la carrera
            que me sea designada en la facultad, para asegurar la integridad
            de los datos en el proceso de generación de horarios.

            @RegistroDeCarrera
            Esquema del escenario: Ingreso individual de un carrera
            Dado que se tiene una carrera con código "<códigoCarreraExistente>", nombre "<nombreCarreraExistente>", duración "<duracionCarreraExistente>" y modalidad "<modalidadCarreraExistente>"
            Cuando se ingrese una carrera con código "<códigoCarreraNueva>", nombre "<nombreCarreraNueva>", duración "<duracionCarreraNueva>" y modalidad "<modalidadCarreraNueva>"
            Entonces se obtendrá la respuesta "<respuestaIngresoCarrera>".

            Ejemplos:
            | códigoCarreraExistente | nombreCarreraExistente    | duracionCarreraExistente | modalidadCarreraExistente | códigoCarreraNueva | nombreCarreraNueva     | duracionCarreraNueva | modalidadCarreraNueva | respuestaIngresoCarrera                                          |
            | ICC                    | Ingenieria en computacion | 9                        | Presencial                | Isw                | Ingenieria en software | 9                    | Presencial            | Se ha creado existosamente la carrera de INGENIERIA EN SOFTWARE. |
            | ISW                    | Ingenieria en software    | 9                        | Presencial                | Isw                | Ingenieria en software | 9                    | Presencial            | La carrera INGENIERIA EN SOFTWARE ya se encuentra registrada.    |
