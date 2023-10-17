import { consulta as modeloConsulta } from "../modelos/index.js";
import { ENUM_CONSULTA_ESTADOS } from "../utils/enums.js";

export const validarSeleccionarMedicoConsulta = async (req, res, next) => {
    try {
        const { id: clienteId } = req.cliente;
        console.log('cliente', req.cliente)

        // Comprueba si ya existe una consulta en curso para este cliente
        const consultaEnCurso = await modeloConsulta.findOne({
            where: {
            clienteId,
            estado: ENUM_CONSULTA_ESTADOS.enCurso
            }
        });
    
        if (consultaEnCurso) {
            // Si ya existe una consulta en curso, se puede manejar como un error
            return res.status(400).json({ error: 'Ya existe una consulta en curso para este cliente.' });
        }


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
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
}