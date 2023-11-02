import { cliente as modeloCliente } from "../modelos/index.js";
import { clienteSchema } from "./esquemas/clientes.js";

export const validarCodigoPostal= async (req, res, next) => {
    const esquema = { codigoPostal: clienteSchema.codigoPostal }
    await middlewareValidar(req, res, next, esquema);
    return
}

export const validarCiudad= async (req, res, next) => {
    const esquema = { ciudad: clienteSchema.ciudad }
    await middlewareValidar(req, res, next, esquema);
    return
}

export const validarCliente = async (req, res, next) => {
    try {
        const {id: usuarioId} = req.usuario
        const cliente = await modeloCliente.findOne({
            where: {
                usuarioId: usuarioId
            }
        })
        if(!cliente) throw new Error('no existe un cliente para ese usuario');
        console.log(cliente.dataValues);
        req.cliente = cliente.dataValues
        next();
    } catch (error) {
        console.error(error);
        res
            .status(401)
            .send({ success: false, result: 'no se pudo verificar al cliente' });
    }
}

