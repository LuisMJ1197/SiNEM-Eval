import gql from "graphql-tag";

export const LoginMutation = gql`
    mutation LoginMutation ($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                usuario_id
                email
                nombre
                apellido1
                apellido2
                telefono
                rol {
                    rol_id
                    rol_name
                }
            }
        }
    }
`;

export const ObtenerUsuarios= gql`
    query ObtenerUsuarios {
        obtenerUsuarios {
            usuario_id
            sede {
                sede_id
                sede_name
            }
            nombre
            apellido1
            apellido2
            email
            telefono
            rol {
                rol_id
                rol_name
            }
        }
    }
`;

export const ObtenerProfesores = gql`
    query ObtenerProfesores {
        obtenerProfesores {
            usuario_id
            sede {
                sede_id
                sede_name
            }
            nombre
            apellido1
            apellido2
            email
            telefono
            rol {
                rol_id
                rol_name
            }
        }
    }
`;

export const ObtenerRoles = gql`
    query ObtenerRoles {
        obtenerRoles {
            rol_id
            rol_name
        }
    }
`;

export const ObtenerDominios = gql`
    query ObtenerDominios {
        obtenerDominios {
            dominio_id
            nombre_dominio
            valor
        }
    }
`;

export const ObtenerSedes = gql`
    query ObtenerSedes {
        obtenerSedes {
            sede_id
            sede_name
        }
    }
`;

export const ObtenerCursos = gql`
    query ObtenerCursos {
        obtenerCursos {
            sede {
                sede_id
                sede_name
            }
            curso_id
            tipo_curso {
                tipo_id
                tipo_name
            }
            modalidad {
                modalidad_id
                modalidad_name
                categoria_instrumento
                instrumento_name
            }
            anno_periodo
            mes_periodo
            rubrica_id
            profesor_asignado {
                profesor_id
                profesor_name
            }
            horario {
                dia
                hora_inicio
                hora_fin
            }
            isActivo
        }
    }
`;

export const ObtenerInstrumentos = gql`
    query ObtenerModalidades {
        obtenerInstrumentos {
            instrumento_id
            instrumento_name
            categoria
        }
    }
`;

export const AgregarCurso = gql`
    mutation AgregarCurso ($curso: CursoInput!) {
        agregarCurso (curso: $curso) {
            status
            errorCode
            resultData
        }
    }
`;

export const ObtenerEstudiantes = gql`
    query ObtenerEstudiantes {
        obtenerEstudiantes {
            sede {
                sede_id
                sede_name
            }
            cedula
            nombre
            apellido1
            apellido2
            telefono
            nombre_encargado
        }
    }
`;

export const RegistrarUsuario = gql`
    mutation RegistrarUsuario ($usuario: UserInput!) {
        registrarUsuario(usuario: $usuario) {
            status
            errorNumber
            resultData
        }
    }
`;

export const RegistrarEstudiante = gql`
    mutation RegistrarEstudiante ($estudiante: EstudianteInput!) {
        registrarEstudiante(estudiante: $estudiante) {
            status
            errorNumber
            resultData
        }
    }
`;

export const ObtenerEstudiantesPorCurso = gql`
    query ObtenerEstudiantesPorCurso($curso_id: Int!) {
        obtenerEstudiantesPorCurso (curso_id: $curso_id) {
            sede {
                sede_id
                sede_name
            }
            estudiante_id
            cedula
            nombre
            apellido1
            apellido2
            telefono
            nombre_encargado
        }
    }
`;

export const EditarEstudiante = gql`
    mutation EditarEstudiante ($estudiante: EstudianteEdit!) {
        editarEstudiante(estudiante: $estudiante) {
            status
            errorNumber
            resultData
        }
    }
`;

export const EditarUsuario = gql`
    mutation EditarUsuario ($usuario: UserEdit!) {
        editarUsuario(usuario: $usuario) {
            status
            errorNumber
            resultData
        }
    }
`;

export const AgregarEstudianteACurso = gql`
    mutation AgregarEstudianteACurso($curso_id: Int!, $estudiante_id: Int!) {
        agregarEstudianteACurso(curso_id: $curso_id, estudiante_id: $estudiante_id) {
            status
            errorNumber
            resultData
        }
    }
`;

export const CambiarRol = gql`
    mutation CambiarRol ($usuario_id: Int!, $rol_id: Int!) {
        cambiarRol(usuario_id: $usuario_id, rol_id: $rol_id) {
            status
            errorNumber
            resultData
        }
    }
`;

export const ObtenerCursosDeProfesor = gql`
    query ObtenerCursosDeProfesor($profesor_id: Int!) {
        obtenerCursosDeProfesor(profesor_id: $profesor_id) {
            sede {
                sede_id
                sede_name
            }
            curso_id
            tipo_curso {
                tipo_id
                tipo_name
            }
            modalidad {
                modalidad_id
                modalidad_name
                categoria_instrumento
                instrumento_name
            }
            anno_periodo
            mes_periodo
            rubrica_id
            profesor_asignado {
                profesor_id
                profesor_name
            }
            horario {
                dia
                hora_inicio
                hora_fin
            }
            isActivo
        }
    }
`;

export const ObtenerRegistrosDeAsistenciaPorCurso = gql`
    query ObtenerRegistrosDeAsistenciaPorCurso ($curso_id: Int!) {
        obtenerRegistrosDeAsistenciaPorCurso (curso_id: $curso_id) {
            numero_registro
            curso_id
            fecha
            estado_por_estudiante {
                estudiante_id
                estudiante_nombre
                estado
            }
        }
    }
`;

export const ObtenerInfoRegistroDeAsistencia = gql`
    query ObtenerInfoRegistroDeAsistencia ($curso_id: Int!, $numero_registro: Int!) {
        obtenerInfoRegistroDeAsistencia (curso_id: $curso_id, numero_registro: $numero_registro) {
            numero_registro
            curso_id
            estudiante_id
            estudiante_nombre
            estado
        }
    }
`;

export const AgregarRegistroDeAsistencia = gql`
    mutation AgregarRegistroDeAsistencia ($registro: RegistroDeAsistenciaInput!) {
        agregarRegistroDeAsistencia(registro: $registro) {
            status
            errorNumber
            resultData
        }
    }
`;

export const AgregarRegistroDeAsistenciaDeEstudiante = gql`
    mutation AgregarRegistroDeAsistenciaDeEstudiante ($registro: RegistroDeAsistenciaDeEstudianteInput!) {
        agregarRegistroDeAsistenciaDeEstudiante(registro: $registro) {
            status
            errorNumber
            resultData
        }
    }
`;

export const EditarRegistroDeAsistencia = gql`
    mutation EditarRegistroDeAsistencia ($registros: [RegistroDeAsistenciaDeEstudianteInput]!) {
        editarRegistroDeAsistencia(registros: $registros) {
            status
            errorNumber
            resultData
        }
    }
`; 

export const EliminarRegistroDeAsistencia = gql`
    mutation EliminarRegistroDeAsistencia ($curso_id: Int!, $numero_registro: Int!) {
        eliminarRegistroDeAsistencia(curso_id: $curso_id, numero_registro: $numero_registro) {
            status
            errorNumber
            resultData
        }
    }
`; 

export const ObtenerRubrica = gql`
    query ObtenerRubrica($curso_id: Int!) {
        obtenerRubrica(curso_id: $curso_id) {
            rubrica_id
            rubrica_name
            dominios {
                dominio_id
                nombre_dominio
                valor
                rubros {
                    rubro_id
                    nombre
                    valor
                    asignaciones {
                        numero_asignacion
                        nombre
                        valor
                    }
                }
            }
        }
    }
`;

export const ObtenerNotas = gql`
    query ObtenerNotas ($curso_id: Int!) {
        obtenerNotas (curso_id: $curso_id) {
            estudiante_id
            estudiante_nombre
            dominioSocioafectivo {
                nota
            }
            dominioCognitivo {
                portfolio {
                nota
                }
                prueba_parcial {
                    numero_asignacion
                    nota
                    nombre
                }
                prueba_final {
                    nota
                }
            }
            dominioPsicomotor {
                practicas {
                    numero_asignacion
                    nota
                    nombre
                }
                tareas {
                    numero_asignacion
                    nota
                    nombre
                }
                prueba_parcial {
                    numero_asignacion
                    nota
                    nombre
                }
                prueba_final {
                    nota
                }
            }
        }
    }
`;

export const ObtenerModalidades = gql`
    query ObtenerModalidades {
        obtenerModalidades {
            modalidad_id
            modalidad_name
            categorias_instrumento {
                categoria
                instrumentos {
                    instrumento_id
                    instrumento_name
                }
            }
        }
    }
`;

export const FinalizarCurso = gql`
    mutation FinalizarCurso ($curso_id: Int!) {
        finalizarCurso(curso_id: $curso_id) {
            status
            errorNumber
            resultData
        }
    }
`;

export const ConfirmarContraseniaAnterior = gql`
    query ConfirmarContraseniaAnterior ($usuario_id: Int!, $contrasenia: String!) {
        confirmarContraseniaAnterior(usuario_id: $usuario_id, contrasenia: $contrasenia) {
           res
        }
    }
`;

export const CambiarContrasenia = gql`
    mutation CambiarContrasenia($usuario_id: Int!, $new_password: String!) {
        cambiarContrasenia(usuario_id: $usuario_id, new_password: $new_password) {
            status
            errorNumber
            resultData
        }
    }
`;