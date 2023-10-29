import { middlewareValidar } from "./index.js";
import { tokenUsuarioSchema, usuarioSchema } from "./esquemas/usuarios.js";
import { actualizarTokenUsuario, enviarTokenUsuario, verificarTokenUsuario} from "../utils/jwt.js";

export const validarTokenUsuario = async (req, res, next) => {
    await middlewareValidar(req, res, next, tokenUsuarioSchema);
    return
}

export const validarUsername = async (req, res, next) => {
  const esquema = { username: usuarioSchema.username  }
  await middlewareValidar(req, res, next, esquema);
  return
}

export const validarPassword = async (req, res, next) => {
    const esquema = { password: usuarioSchema.password  }
    await middlewareValidar(req, res, next, esquema);
    return
}

export const validarDNI = async (req, res, next) => {
    const esquema = { dni: usuarioSchema.dni  }
    await middlewareValidar(req, res, next, esquema);
    return
}

export const validarTelefono = async (req, res, next) => {
    const esquema = { telefono: usuarioSchema.username  }
    await middlewareValidar(req, res, next, esquema);
    return
}

export const validarDireccion = async (req, res, next) => {
    const esquema = { direccion: usuarioSchema.direccion  }
    await middlewareValidar(req, res, next, esquema);
    return
}

export const validarUsuario = async (req, res, next) => {
    try {
        //console.log("req 1", req); 
        await validarTokenUsuario(req, res, next);
        const { tokenUsuario } = req.cookies;
        //console.log("req cookies", req.cookies); 
        const usuarioVerificado = await verificarTokenUsuario(tokenUsuario);
        if (!usuarioVerificado) throw new Error("no se encontro ningún usuario logueado");
        req.usuario = usuarioVerificado;
        //actualiza el token si es necesario
        const tokenActualizado = actualizarTokenUsuario(tokenUsuario);
        //console.log({antes: tokenUsuario, despues: tokenActualizado})
        enviarTokenUsuario(tokenActualizado, res);
        next();
    } catch (error) {
        console.error(error);
        res
            .status(401)
            .send({ success: false, result: 'no se pudo verificar al usuario' });
    }
}
