import { cliente as modeloCliente } from "../modelos/index.js";

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

