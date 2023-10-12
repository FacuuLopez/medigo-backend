import { actualizarTokenUsuario, enviarTokenUsuario, verificarTokenMedico } from "../utils/jwt.js"
import { medicoSchema } from "./esquemas/medicos.js";
 

export const validarMedico = async (req, res, next) => {
    try {
        await validarTokenUsuario(req, res, next);
        const { tokenUsuario } = req.cookies;
        const usuarioVerificado = await verificarTokenMedico(tokenUsuario);
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

export const validarMatricula = async (req, res, next) => {
    const esquema = { nroMatricula: medicoSchema.nroMatricula  }
    await middlewareValidar(req, res, next, esquema);
    return
}

export const validarRadioAccion = async (req, res, next) => {
    const esquema = { radioAccion: medicoSchema.radioAccion  }
    await middlewareValidar(req, res, next, esquema);
    return
}

export const validarPrecio = async (req, res, next) => {
    const esquema = { precio: medicoSchema.precio  }
    await middlewareValidar(req, res, next, esquema);
    return
}