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