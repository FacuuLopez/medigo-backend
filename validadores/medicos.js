import { actualizarTokenUsuario, enviarTokenUsuario, verificarTokenMedico } from "../../utils/jwt.js"

export const validarMedico = async (req, res, next) => {
    try {
        const { tokenUsuario } = req.cookies;
        const medicoVerificado = await verificarTokenMedico(tokenUsuario);
        if (!usuarioVerificado) throw new Error("no se encontro ningún usuario logueado");
        req.usuario = usuarioVerificado;
        //actualiza el token si es necesario
        const tokenActualizado = actualizarTokenUsuario(tokenUsuario);
        enviarTokenUsuario(tokenActualizado, res);
        next();
    } catch (error) {
        console.error(error);
        res
            .status(401)
            .send({ success: false, result: 'no se pudo verificar al medico' });
    }
}