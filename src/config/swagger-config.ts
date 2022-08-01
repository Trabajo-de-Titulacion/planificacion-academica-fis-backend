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
        }
    }
}

const configuracionesSwagger = {
    titulo: 'SISTEMA DE PLANIFICACIÓN ACADÉMICA DE LA FACULTAD DE INGENIERÍA DE SISTEMAS',
    descripcion: 'API del proyecto creada con Nest.js y TypeORM.',
    version: '1.0.0',
    tag: 'api',
}

export { configuracionesAPI as configuraciones, configuracionesSwagger };