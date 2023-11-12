import { consultaSchema } from "./esquemas/consultas.js";
import { middlewareValidar } from "./index.js";
import { consulta as modeloConsulta } from "../modelos/index.js";
import { ENUM_CONSULTA_ESTADOS } from "../utils/enums.js";

const _encontrarConsultaCliente = async (clienteId, estado) => {
  return await modeloConsulta.findOne({
    where: {
      clienteId,
      estado,
    },
  });
};

const _encontrarConsultaMedico = async (medicoId, estado) => {
  return await modeloConsulta.findOne({
    where: {
      medicoId,
      estado,
    },
  });
};

export const validarMotivo = async (req, res, next) => {
  const esquema = { motivo: consultaSchema.motivo };
  await middlewareValidar(req, res, next, esquema);
  return;
};

export const validarSintomas = async (req, res, next) => {
  const esquema = { sintomas: consultaSchema.sintomas };
  await middlewareValidar(req, res, next, esquema);
  return;
};

export const validarPrecio = async (req, res, next) => {
  const esquema = { precio: consultaSchema.precio };
  await middlewareValidar(req, res, next, esquema);
  return;
};

export const validarTiempoLlegada = async (req, res, next) => {
  const esquema = { tiempoLLegada: consultaSchema.tiempoLLegada };
  await middlewareValidar(req, res, next, esquema);
  return;
};

export const validarValoracionMedico = async (req, res, next) => {
  const esquema = { valoracionMedico: consultaSchema.valoracionMedico };
  await middlewareValidar(req, res, next, esquema);
  return;
};

export const validarValoracionCliente = async (req, res, next) => {
  const esquema = { valoracionCliente: consultaSchema.valoracionCliente };
  await middlewareValidar(req, res, next, esquema);
  return;
};

export const validarDireccion = async (req, res, next) => {
  const esquema = { direccion: consultaSchema.direccion };
  await middlewareValidar(req, res, next, esquema);
  return;
};

export const validarLatitudCliente = async (req, res, next) => {
  const esquema = { latitudCliente: consultaSchema.latitudCliente };
  await middlewareValidar(req, res, next, esquema);
  return;
};

export const validarLongitudCliente = async (req, res, next) => {
  const esquema = { longitudCliente: consultaSchema.longitudCliente };
  await middlewareValidar(req, res, next, esquema);
  return;
};
export const validarSeleccionarMedicoConsulta = async (req, res, next) => {
  try {
    const { id: clienteid } = req.cliente;
    //console.log("cliente", req.cliente);
    const consulta = await _encontrarConsultaCliente(
      clienteid,
      ENUM_CONSULTA_ESTADOS.seleccionandoMedico
    );
    //console.log("la consulta entera", consulta);
    //console.log("consulta", consulta.dataValues);
    req.consulta = consulta.dataValues;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "error interno del servidor." });
  }
};

export const validarValorarConsultaCliente = async (req, res, next) => {
  try {
    const { id: clienteId } = req.cliente;
    const consulta = await _encontrarConsultaCliente(
      clienteId,
      ENUM_CONSULTA_ESTADOS.calificando
    );
    req.consulta = consulta.dataValues;
    next();
  } catch (error) {
    console.error(error);
    next()
  }
};

export const validarValorarConsultaMedico = async (req, res, next) => {
  try {
    const { id: medicoId } = req.medico;
    const consulta = await _encontrarConsultaMedico(
      medicoId,
      ENUM_CONSULTA_ESTADOS.calificando
    );
    req.consulta = consulta.dataValues;
    next();
  } catch (error) {
    console.error(error);
  }
};

export const validarObservacion = async (req, res, next) => {
  const esquema = { observacion: consultaSchema.observacion };
  await middlewareValidar(req, res, next, esquema);
  return;
};

export const validarfechaSeleccion = async (req, res, next) => {
  const esquema = {
    observacion: consultaSchema.fechaSeleccion,
  };
  await middlewareValidar(req, res, next, esquema);
  return;
};
