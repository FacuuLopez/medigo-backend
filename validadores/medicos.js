import { medico as modeloMedico} from "../modelos/index.js";

 
export const validarMedico = async (req, res, next) => {
    try {
        const {id: usuarioId} = req.usuario
        const medico = await modeloMedico.findOne({
            where: {
                usuarioId: usuarioId
            }
        })
        if(!medico) throw new Error('no existe un medico para ese usuario');
        next();
    } catch (error) {
        console.error(error);
        res
            .status(401)
            .send({ success: false, result: 'no se pudo verificar al medico' });
    }
}