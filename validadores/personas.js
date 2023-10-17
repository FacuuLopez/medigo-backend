import { personaSchema } from "./esquemas/personas.js";
import { middlewareValidar } from "./index.js";

export const validarNombre= async (req, res, next) => {
    const esquema = { nombre: personaSchema.nombre }
    await middlewareValidar(req, res, next, esquema);
    return
}

export const validarApellido= async (req, res, next) => {
    const esquema = { apellido: personaSchema.apellido }
    await middlewareValidar(req, res, next, esquema);
    return
}

export const validarSexo= async (req, res, next) => {
    const esquema = { sexo: personaSchema.sexo }
    await middlewareValidar(req, res, next, esquema);
    return
}

export const validarFechaNacimiento= async (req, res, next) => {
    const esquema = { fechaNacimiento: personaSchema.fechaNacimiento }
    await middlewareValidar(req, res, next, esquema);
    return
}