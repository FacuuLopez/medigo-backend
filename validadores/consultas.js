import { consultaSchema } from "./esquemas/consultas.js";
import { middlewareValidar } from "./index.js";
import { consulta as modeloConsulta } from "../modelos/index.js";
import { ENUM_CONSULTA_ESTADOS } from "../utils/enums.js";

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

export const validarSeleccionarMedicoConsulta = async (req, res, next) => {
    try {
        const { id: clienteId } = req.cliente;
        console.log('cliente', req.cliente)
        const consulta = await modeloConsulta.findOne({
            where: {
                clienteId,
                estado: ENUM_CONSULTA_ESTADOS.solicitandoMedico
            }
        });
        console.log('la consulta entera',consulta);
        console.log('consulta', consulta.dataValues);
        req.consulta = consulta.dataValues;
        next();
    } catch (error) {
        console.error(error)
    }
}