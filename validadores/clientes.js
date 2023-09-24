import { actualizarTokenUsuario, enviarTokenUsuario, verificarTokenCliente } from "../../utils/jwt.js"

export const validarCliente = async (req, res, next) => {
    try {
        await validarTokenUsuario(req, res, next);
        const { tokenUsuario } = req.cookies;
        const usuarioVerificado = await verificarTokenCliente(tokenUsuario);
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
            .send({ success: false, result: 'no se pudo verificar al cliente' });
    }
}