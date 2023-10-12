import { consultaSchema } from "./esquemas/consultas.js";
import { middlewareValidar } from "./index.js";

export const validarMotivo = async (req, res, next) => {
    const esquema = { motivo: consultaSchema.motivo }
    await middlewareValidar(req, res, next, esquema);
    return
}

export const validarSintomas = async (req, res, next) => {
    const esquema = { sintomas: consultaSchema.sintomas }
    await middlewareValidar(req, res, next, esquema);
    return
}

export const validarPrecio = async (req, res, next) => {
    const esquema = { precio: consultaSchema.precio }
    await middlewareValidar(req, res, next, esquema);
    return
}

export const validarTiempoLlegada = async (req, res, next) => {
    const esquema = { tiempoLLegada: consultaSchema.tiempoLLegada }
    await middlewareValidar(req, res, next, esquema);
    return
}

export const validarValoracionMedico = async (req, res, next) => {
    const esquema = { valoracionMedico: consultaSchema.valoracionMedico }
    await middlewareValidar(req, res, next, esquema);
    return
}

export const validarValoracionCliente= async (req, res, next) => {
    const esquema = { valoracionCliente: consultaSchema.valoracionCliente }
    await middlewareValidar(req, res, next, esquema);
    return
}

export const validarDireccion= async (req, res, next) => {
    const esquema = { direccion: consultaSchema.direccion }
    await middlewareValidar(req, res, next, esquema);
    return
}