import { consulta as modeloConsulta } from "../modelos/index.js";
import { ENUM_CONSULTA_ESTADOS } from "../utils/enums.js";

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