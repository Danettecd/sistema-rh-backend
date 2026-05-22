const swaggerJSDoc = require('swagger-jsdoc');

const empleadoMultipartSchema = {
  type: 'object',
  required: ['nombre'],
  properties: {
    nombre: { type: 'string', example: 'Juan Perez' },
    puesto: { type: 'string', example: 'Auxiliar' },
    telefono: { type: 'string', example: '5555555555' },
    direccion: { type: 'string', example: 'Calle 1' },
    email: { type: 'string', format: 'email', example: 'juan@example.com' },
    rfc: { type: 'string', example: 'PEPJ800101ABC' },
    curp: { type: 'string', example: 'PEPJ800101HDFRRN09' },
    nss: { type: 'string', example: '12345678901' },
    fechaIngreso: { type: 'string', format: 'date' },
    fechaNacimiento: { type: 'string', format: 'date' },
    foto: {
      type: 'string',
      format: 'binary'
    }
  }
};

const jsonRequestSchema = {
  type: 'object',
  additionalProperties: true
};

const protectedListResponse = {
  200: {
    description: 'Listado obtenido correctamente'
  },
  401: {
    description: 'Token requerido'
  },
  403: {
    description: 'Token invalido o acceso denegado'
  },
  500: {
    description: 'Error del servidor'
  }
};

const protectedCreateResponse = {
  201: {
    description: 'Registro creado correctamente'
  },
  400: {
    description: 'Solicitud invalida'
  },
  401: {
    description: 'Token requerido'
  },
  403: {
    description: 'Token invalido o acceso denegado'
  },
  500: {
    description: 'Error del servidor'
  }
};

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SIGPA RH API',
      version: '1.0.0',
      description: 'Documentación de API para sistema de Recursos Humanos SIGPA'
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor local'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'admin@example.com'
            },
            password: {
              type: 'string',
              format: 'password',
              example: 'password'
            }
          }
        },
        TokenResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string'
            }
          }
        },
        EmpleadoMultipart: empleadoMultipartSchema,
        GenericJsonRequest: jsonRequestSchema
      }
    },
    tags: [
      { name: 'Auth' },
      { name: 'Empleados' },
      { name: 'Vehiculos' },
      { name: 'Incidencias' },
      { name: 'Asistencia' },
      { name: 'Uniformes' },
      { name: 'Salud' }
    ],
    paths: {
      '/api/login': {
        post: {
          tags: ['Auth'],
          summary: 'Iniciar sesion',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/LoginRequest'
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Login correcto',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/TokenResponse'
                  }
                }
              }
            },
            401: { description: 'Contrasena incorrecta' },
            404: { description: 'Usuario no encontrado' },
            500: { description: 'Error del servidor' }
          }
        }
      },
      '/empleados': {
        get: {
          tags: ['Empleados'],
          summary: 'Obtener empleados',
          security: [{ bearerAuth: [] }],
          responses: protectedListResponse
        },
        post: {
          tags: ['Empleados'],
          summary: 'Crear empleado',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  $ref: '#/components/schemas/EmpleadoMultipart'
                }
              }
            }
          },
          responses: protectedCreateResponse
        }
      },
      '/empleados/{id}': {
        get: {
          tags: ['Empleados'],
          summary: 'Obtener empleado por ID',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: protectedListResponse
        },
        put: {
          tags: ['Empleados'],
          summary: 'Actualizar empleado',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            required: true,
            content: {
              'multipart/form-data': {
                schema: {
                  $ref: '#/components/schemas/EmpleadoMultipart'
                }
              }
            }
          },
          responses: protectedCreateResponse
        },
        delete: {
          tags: ['Empleados'],
          summary: 'Eliminar empleado',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: protectedListResponse
        }
      },
      '/vehiculos': {
        get: {
          tags: ['Vehiculos'],
          summary: 'Obtener vehiculos',
          security: [{ bearerAuth: [] }],
          responses: protectedListResponse
        },
        post: {
          tags: ['Vehiculos'],
          summary: 'Crear vehiculo',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    numeroVehiculo: { type: 'string' },
                    marca: { type: 'string' },
                    modelo: { type: 'string' },
                    anio: { type: 'string' },
                    placas: { type: 'string' },
                    fotoVehiculo: { type: 'string', format: 'binary' }
                  }
                }
              }
            }
          },
          responses: protectedCreateResponse
        }
      },
      '/incidencias': {
        get: {
          tags: ['Incidencias'],
          summary: 'Obtener incidencias',
          security: [{ bearerAuth: [] }],
          responses: protectedListResponse
        },
        post: {
          tags: ['Incidencias'],
          summary: 'Crear incidencia',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/GenericJsonRequest' }
              }
            }
          },
          responses: protectedCreateResponse
        }
      },
      '/asistencia': {
        get: {
          tags: ['Asistencia'],
          summary: 'Obtener asistencias',
          security: [{ bearerAuth: [] }],
          responses: protectedListResponse
        },
        post: {
          tags: ['Asistencia'],
          summary: 'Crear asistencia',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/GenericJsonRequest' }
              }
            }
          },
          responses: protectedCreateResponse
        }
      },
      '/uniformes': {
        get: {
          tags: ['Uniformes'],
          summary: 'Obtener uniformes',
          security: [{ bearerAuth: [] }],
          responses: protectedListResponse
        },
        post: {
          tags: ['Uniformes'],
          summary: 'Crear uniforme',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/GenericJsonRequest' }
              }
            }
          },
          responses: protectedCreateResponse
        }
      },
      '/salud': {
        get: {
          tags: ['Salud'],
          summary: 'Obtener expedientes de salud',
          security: [{ bearerAuth: [] }],
          responses: protectedListResponse
        },
        post: {
          tags: ['Salud'],
          summary: 'Crear expediente de salud',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/GenericJsonRequest' }
              }
            }
          },
          responses: protectedCreateResponse
        }
      },
      '/salud/{id}': {
        get: {
          tags: ['Salud'],
          summary: 'Obtener expediente de salud por ID',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: protectedListResponse
        },
        put: {
          tags: ['Salud'],
          summary: 'Actualizar expediente de salud',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/GenericJsonRequest' }
              }
            }
          },
          responses: protectedCreateResponse
        },
        delete: {
          tags: ['Salud'],
          summary: 'Eliminar expediente de salud',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' } }],
          responses: protectedListResponse
        }
      }
    }
  },
  apis: []
};

module.exports = swaggerJSDoc(options);
