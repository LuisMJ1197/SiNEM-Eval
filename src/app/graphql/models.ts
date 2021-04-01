export type User = {
    usuario_id: number,
    sede_id: number,
    email: String,
    nombre: String,
    apellido1: String,
    apellido2: String,
    telefono: String,
    rol_id: number
}

export type LoginData = {
    token: String,
    user: User
}