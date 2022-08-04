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
            },
        },
        accciones: {
            ruta: 'api/acciones',
            tag: 'Acciones',
            operaciones: {
                obtenerAcciones: {
                    ruta: '/obtenerAcciones',
                    description: 'Método para obtener todas las acciones de todos los roles.'
                },
                obtenerAccionesPorRol: {
                    ruta: '/obtenerAccionesPorRol/:id',
                    description: 'Método de las acciones de un rol.'
                }
            }
        },
        espacios_fisicos: {
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
        horas_no_disponibles: {
            ruta: 'api/horas_no_disponibles',
            tag: 'Horas no disponibles',
            operaciones: {
                obtenerHorasNoDisponiblesPorDocenteId: {
                    ruta: '/obtenerHorasNoDisponiblesPorDocente/:id',
                    descripcion: 'Método para obtener todas las horas no disponibles de un docente mediante su ID.'
                },
                crearHoraNoDisponible: {
                    ruta: '/crearHoraNoDisponible',
                    descripcion: 'Método para crear una hora no disponible para un docente.'
                },
                crearHorasNoDisponibles: {
                    ruta: '/crearHorasNoDisponibles',
                    descripcion: 'Método para crear múltiples horas no disponibles para un docente.'
                },
                eliminarHorasNoDisponiblesPorDocenteId: {
                    ruta: '/eliminarHoras/:id',
                    descripcion: 'Método para eliminar horas no disponibles de un docente.'
                },
            }
        },
    }
}

const configuracionesSwagger = {
    titulo: 'SISTEMA DE PLANIFICACIÓN ACADÉMICA DE LA FACULTAD DE INGENIERÍA DE SISTEMAS',
    descripcion: 'API del proyecto creada con Nest.js y TypeORM.',
    version: '1.0.0',
    tag: 'api',
}

export { configuracionesAPI as configuraciones, configuracionesSwagger };