export const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
export const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
export const tipos = {negra: "Negra", blanca: "Blanca", corchea: "Corchea", semicorchea: "Semicorchea", redonda: "Redonda", egresado: "Egresado"};
export const tiposEstilos = { Negra: "flaticon-negra", Blanca: "flaticon-blanca", Semicorchea: "flaticon-semicorchea", Corchea: "flaticon-nota-musical", Redonda: "flaticon-semibreve", Egresado: "flaticon-mortarboard"};

export type User = {
    usuario_id: number,
    sede: Sede,
    email: String,
    nombre: String,
    apellido1: String,
    apellido2: String,
    telefono: String,
    rol: Rol
}

export type Sede = {
    sede_id: number,
    sede_name: string
}

export type Rol = {
    rol_id: number,
    rol_name: string
}

export type LoginData = {
    token: String,
    user: User
}

export type Modalidad = {
    modalidad_id: number,
    modalidad_name: string,
    categorias_instrumento: Categoria[]
}

export type Categoria = {
    categoria: string,
    instrumentos: Instrumento[]
}

export type Instrumento = {
    instrumento_id: number,
    instrumento_name: string
}

export type Curso = {
    sede: Sede,
    curso_id: number,
    tipo_curso: TipoCurso,
    modalidad: ModalidadCurso
    profesor_asignado: ProfesorCursoInfo,
    rubrica_id: number,
    anno_periodo: string,
    mes_periodo: number,
    isActivo: boolean,
    horario: Horario[]
}

export type ModalidadCurso = {
    curso_id: number,
    modalidad_id: number,
    modalidad_name: string,
    categoria_instrumento: string,
    instrumento_name: string
}

export type Horario = {
    curso_id: number,
    dia: number,
    hora_inicio: string,
    hora_fin: string
}

export type TipoCurso = {
    tipo_id: number,
    tipo_name: string
}

export type ProfesorCursoInfo = {
    profesor_id: number,
    profesor_name: String
}

export type Estudiante = {
    sede: Sede,
    estudiante_id: number,
    cedula: string,
    nombre: string,
    apellido1: string,
    apellido2: string,
    telefono: string,
    nombre_encargado: string
}

export type RegistroDeAsistencia = {
    numero_registro: number,
    curso_id: number,
    fecha: string,
    estado_por_estudiante: RegistroDeAsistenciaDeEstudiante[]
}

export type RegistroDeAsistenciaDeEstudiante = {
    curso_id: number,
    numero_registro: number,
    estudiante_id: number,
    estudiante_nombre: string,
    estado: string
}

export type UsuarioInput = {
    sede_id: number,
    nombre: String,
    apellido1: String,
    apellido2: String,
    email: String,
    telefono: String,
    rol_id: number
}