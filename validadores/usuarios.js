import { middlewareValidar } from "./index.js";
import { tokenUsuarioSchema } from "./esquemas/usuarios.js";
import { actualizarTokenUsuario, enviarTokenUsuario, verificarTokenUsuario} from "../utils/jwt.js";

export const validarTokenUsuario = async (req, res, next) => {
    await middlewareValidar(req, res, next, tokenUsuarioSchema);
    return
}

export const validarUsuario = async (req, res, next) => {
    try {
        await validarTokenUsuario(req, res, next);
        const { tokenUsuario } = req.cookies; 
        const usuarioVerificado = await verificarTokenUsuario(tokenUsuario);
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