const configuracionesAPI = {
    controladores: {
        usuario: {
            ruta: 'api/usuarios',
            tag: 'Usuarios',
            operaciones: {
                obtenerUsuarios: {
                    ruta: '/obtenerUsuarios',
                    descripcion: 'Método que permite listar los usuarios del sistema sin su clave.'
                },
                crearUsuario: {
                    ruta: '/crearUsuario',
                    descripcion: 'Método que permite crear un usuario pasando como parámetros su correo institucional y una clave.'
                },
                obtenerUsuarioCompletoPorSuID: {
                    ruta: '/obtenerUsuarioCompletoPorSuID/:id',
                    descripcion: 'Método que permite obtener toda la información de un usuario por medio de su identificador (ID).'
                }
            },
        },
        espaciosFisicos: {
            ruta: 'api/espacios_fisicos',
            tag: 'Espacios físicos',
            operaciones: {
                obtenerEspaciosFisicos: {
                    ruta: '/obtenerEspaciosFisicos',
                    descripcion: 'Método para obtener todos los espacios físicos.'
                },
                obtenerEspacioFisicoPorId: {
                    ruta: '/obtenerEspaciosFisicos/:id',
                    descripcion: 'Método para obtener un espacio físico mediante su ID.'
                },
                crearEspacioFisico: {
                    ruta: '/crearUno',
                    descripcion: 'Método para crear un espacio físico.'
                },
                crearMultiplesEspaciosFisicos: {
                    ruta: '/crearMultiples',
                    descripcion: 'Método para crear múltiples espacios físicos mediante un archivo CSV.'
                },
                actualizarEspacioFisicoPorId: {
                    ruta: '/actualizarEspacioFisico/:id',
                    descripcion: 'Método para actualizar un espacio físico mediante su ID.'
                },
                eliminarEspacioFisicoPorId: {
                    ruta: '/eliminarEspacioFisico/:id',
                    descripcion: 'Método para eliminar un espacio físico mediante su ID.'
                },
            }
        },
        horasNoDisponibles: {
            ruta: 'api/horas_no_disponibles',
            tag: 'Horas no disponibles',
            operaciones: {
                solicitarHorasNoDisponibles: {
                    ruta: '/solicitarHorasNoDisponibles/:id',
                    descripcion: 'Método para solicitar múltiples horas no disponibles de un docente.'
                },
                obtenerHorasNoDisponiblesSolicitadasPorDocenteId: {
                    ruta: '/obtenerHorasNoDisponiblesSolicitadasPorDocenteId/:id',
                    descripcion: 'Método para obtener todas las horas no disponibles de un docente mediante su ID.'
                },
                aprobarSolicitudHorasNoDisponiblesPorDocenteId: {
                    ruta: '/aprobarSolicitudHorasNoDisponiblesPorDocenteId/:id',
                    descripcion: 'Método para aprobar la última solicitud de horas no disponibles de un docente mediante su ID.'
                },
                rechazarSolicitudHorasNoDisponiblesPorDocenteId: {
                    ruta: '/rechazarSolicitudHorasNoDisponiblesPorDocenteId/:id',
                    descripcion: 'Método para rechazar la última solicitud de horas no disponibles de un docente mediante su ID.'
                },
                eliminarHorasNoDisponiblesPorDocenteId: {
                    ruta: '/eliminarHoras/:id',
                    descripcion: 'Método para eliminar horas no disponibles de un docente.'
                },
                obtenerTodasLasHorasNoDisponiblesAprobadas: {
                    ruta: '/obtenerTodasLasHorasNoDisponiblesAprobadas',
                    descripcion: 'Método para obtener todas las horas no disponibles aprobadas de cada docente, para usarlas en la generación de horarios.'
                }
            }
        },
        docente: {
            ruta: 'api/docente',
            tag: 'Docente',
            operaciones: {
                crearUnDocente: {
                    ruta: '/crearUnDocente',
                    descripcion: 'Método que permite crear y enviar un correo eletrónico con la clave de acceso a un docente.'
                },
                crearVariosDocentes: {
                    ruta: '/crearVariosDocentes',
                    descripcion: 'Método que permite crear y enviar un correo eletrónico con la clave de acceso a cada docente no duplicado dentro del archivo csv.'
                },
                obtenerDocentePorID: {
                    ruta: '/obtenerDocentePorID/:id',
                    descripcion: 'Método que permite obtener el nombre y correo electrónico de un docente por medio de su identificador (ID).'
                },
                obtenerDocentePorCorreoElectronico: {
                    ruta: '/obtenerDocentePorCorreoElectronico/:correo',
                    descripcion: 'Método que permite obtener el nombre e identificador (ID) de un docente por medio de su correo electrónico.'
                },
                obtenerDocentes: {
                    ruta: '/obtenerDocentes',
                    descripcion: 'Método que permite obtener un arreglo con todos los docentes registrados en el sistema.'
                },
                actualizarDocentePorID: {
                    ruta: '/actualizarDocentePorID/:id',
                    descripcion: 'Método que permite actualizar los datos del docente por medio del identificador (ID).'
                },
                eliminarDocentePorID: {
                    ruta: 'eliminarDocentePorID/:id',
                    descripcion: 'Método que permite eliminar un docente por medio de su identificador (ID).'
                },
            }
        },
        asignatura: {
            ruta: 'api/asignatura',
            tag: 'Asignatura',
            operaciones: {
                crearUnaAsignatura: {
                    ruta: '/crearUnaAsignatura',
                    descripcion: 'Método que permite crear una asignatura.'
                },
                crearVariasAsignaturas: {
                    ruta: '/crearVariasAsignaturas',
                    descripcion: 'Método que permite crear asignaturas no duplicadas dentro del archivo csv.'
                },
                obtenerAsignaturaPorID: {
                    ruta: '/obtenerAsignaturaPorID/:id',
                    descripcion: ' Método que permite obtener el código, nombre y cantidad de créditos de una asignatura por medio de su identificador (ID).'
                },
                obtenerAsignaturaPorCodigo: {
                    ruta: '/obtenerAsignaturaPorCodigo/:codigo',
                    descripcion: 'Método que permite obtener el identificador, nombre y cantidad de créditos de una asignatura por medio de su código'
                },
                obtenerAsignaturas: {
                    ruta: '/obtenerAsignaturas',
                    descripcion: 'Método que permite obtener un arreglo con todas las asignaturas registradas en el sistema.'
                },
                actualizarAsignaturaPorID: {
                    ruta: '/actualizarAsignaturaPorID/:id',
                    descripcion: 'Método que permite actualizar los datos de la asignatura por medio del identificador (ID).'
                },
                eliminarAsignaturaPorID: {
                    ruta: 'eliminarAsignaturaPorID/:id',
                    descripcion: 'Método que permite eliminar una asignatura por medio de su identificador (ID).'
                }
            }
        },
        carrera: {
            ruta: 'api/carrera',
            tag: 'Carrera',
            operaciones: {
                crearUnaCarrera: {
                    ruta: '/crearUnaCarrera',
                    descripcion: 'Método que permite crear una carrera.'
                },
                obtenerCarreraPorID: {
                    ruta: '/obtenerCarreraPorID/:id',
                    descripcion: 'Método que permite obtener el código, nombre, duración y modalidad de la carrera por medio de su identificador (ID).'
                },
                obtenerCarreraPorCodigo: {
                    ruta: '/obtenerCarreraPorCodigo/:codigo',
                    descripcion: 'Método que permite obtener el identificador, nombre, duración y modalidad de la carrera por medio de su código.'
                },
                obtenerCarreras: {
                    ruta: '/obtenerCarreras',
                    descripcion: 'Método que permite obtener un arreglo con todas las carreras registradas en el sistema.'
                },
                actualizarCarreraPorID: {
                    ruta: '/actualizarCarreraPorID/:id',
                    descripcion: 'Método que permite actualizar los datos de carrera por medio del identificador (ID).'
                },
                eliminarCarreraPorID: {
                    ruta: '/eliminarCarreraPorID/:id',
                    descripcion: 'Método que permite eliminar una carrera por medio de su identificador (ID).'
                }
            }
        },
        horario: {
            ruta: 'api/horario',
            tag: 'Horario',
            operaciones: {
                crearHorario: {
                    ruta: '/crearHorario',
                    descripcion: ''
                },
                obtenerHorarioDocente: {
                    ruta: '/obtenerHorarioDocente/:nombreDocente/:idHorario',
                    descripcion: 'Método para obtener el horario del docente seleccionado.'
                },
                obtenerHorarioGrupo: {
                    ruta: '/obtenerHorarioGrupo/:grupo/:idHorario',
                    descripcion: 'Método para obtener el horario de un semestre, paralelo y grupo específico.'
                },
                obtenerHorarios: {
                    ruta: '/obtenerHorarios',
                    descripcion: 'Método para obtener una lista de horarios generados previamente.'
                },
                obtenerHorarioPorID: {
                    ruta: '/obtenerHorarioPorID/:id',
                    descripcion: 'Método para obtener el arreglo con la información generada de un horario específico.'
                }
            }
        },
    }
}

const opciones = {
    swaggerOptions: {
        authAction: {
            defaultBearerAuth: {
                name: 'defaultBearerAuth',
                schema: {
                    description: 'Default',
                    type: 'http',
                    in: 'header',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
                value: 'EjemploDeBearerAuthToken123',
            },
        },
    },
};

const configuracionesSwagger = {
    titulo: 'SISTEMA DE PLANIFICACIÓN ACADÉMICA DE LA FACULTAD DE INGENIERÍA DE SISTEMAS',
    descripcion: 'API del proyecto creada con Nest.js y TypeORM.',
    version: '1.0.0',
    tag: 'api',
}

export { configuracionesAPI as configuraciones, configuracionesSwagger, opciones };