import { consulta, medico } from "../modelos/index.js"
import { ENUM_CONSULTA_ESTADOS } from "../utils/enums.js";


class consultasController {
    constructor() { }

    solicitarConsulta = async (req, res, next) => {
        // se debe de validar en los validadores que no exista otra
        // consulta para ese usuario con estado "iniciada"
        try {
            const { id: clienteId } = req.cliente
            const { sintomas, motivo, direccion } = req.body;
            await consulta.create({
                clienteId,
                sintomas,
                motivo,
                direccion,
                estado: ENUM_CONSULTA_ESTADOS.solicitandoMedico
            });
            const medicosDisponibles = null // hay que retornar el array de medicos disponibles
            res
                .status(200)
                .send("solicitando profesional")
            // .json({ medicosDisponibles });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: error.message,
            });
        }
    }

    seleccionarMedicoConsulta = async (req, res, next) => {
        try {
            const { id: consultaId } = req.consulta // hay que agregarla cuando se valida
            //tiene que ser la unica consulta para ese clienteId con estado 'seleccionando medico'
            const { medicoId } = req.body;
            const medicoElegido = await medico.findByPk(medicoId);
            const { precio } = medicoElegido.dataValues;
            const tiempoLLegada = null // aca necesitamos calcular a que hora se estima que llega el medico
            const iniciarConsulta = await consulta.findByPk(consultaId);
            const consultaIniciada = await iniciarConsulta.update({
                medicoId,
                precio,
                tiempoLLegada,
                estado: ENUM_CONSULTA_ESTADOS.seleccionandoMedico
            });
            res
                .status(200)
                .json({message:"consulta iniciada con exito", consulta: consultaIniciada.dataValues });
        } catch (error) {
            console.error(error)
            res.status(500).send("no se pudo iniciar la consutla");
        }

    }

    aceptarConsulta = async (req, res, next) => {
        try {
            const { consultaId } = req.body;
            const consultaAceptada = await consulta.findByPk(consultaId);
            await consultaAceptada.update({
                estado: ENUM_CONSULTA_ESTADOS.enCurso
            });
            res
                .status(200)
                .send('consulta aceptada');
        } catch (error) {
            res
                .status(500)
                .send(error.message)
        }
    }

    cancelarConsulta = async (req, res, next) => {
        try {
            const { id } = req.params;
            await consulta.destroy({
                where: {
                    id
                }
            });
            // Enviar una respuesta exitosa
            res.status(200).json({ message: 'Consulta eliminada exitosamente' });
        } catch (error) {
            // Manejar cualquier error que ocurra durante el proceso
            res.status(500).json({ error: 'Error al eliminar la consulta' });
        }
    }

    finalizarConsulta = async (req, res, next) => {
        try {
            const { consultaId } = req.body;
            const consultaFinalizada = await consulta.findByPk(consultaId);
            await consultaFinalizada.update({
                estado: ENUM_CONSULTA_ESTADOS.finalizada
            });
            res
                .status(200)
                .send('consulta finalizada');
        } catch (error) {
            res
                .status(500)
                .send(error.message)
        }
    }

    valorarConsultaCliente = async (req, res, next) => {
        const { consultaId } = req.consulta // hay que agregarla cuando se valida
        //tiene que ser la unica consulta para ese clienteId con estado 'en curso'
        const { valoracion } = req.body
        try {
            const consultaValorada = await consulta.findByPk(consultaId);
            await consultaValorada.update({
                valoracionCliente: valoracion
            });
            res
                .status(200)
                .send('consulta valorada');
        } catch (error) {
            res
                .status(500)
                .send(error.message)
        }
    }

    valorarConsultaMedico = async (req, res, next) => {
        const { consultaId } = req.consulta // hay que agregarla cuando se valida
        //tiene que ser la unica consulta para ese clienteId con estado 'en curso'
        const { valoracion } = req.body
        try {
            const consultaValorada = await consulta.findByPk(consultaId);
            await consultaValorada.update({
                valoracionMedico: valoracion
            });
            res
                .status(200)
                .send('consulta valorada');
        } catch (error) {
            res
                .status(500)
                .send(error.message)
        }
    }

}

export default consultasController;