import { middlewareValidar } from "./index.js";
import { tokenUsuarioSchema, usuarioSchema } from "./esquemas/usuarios.js";

export const validarTokenUsuario = async (req, res, next) => {
    const esquema = { tokenUsuario: tokenUsuarioSchema };
    await middlewareValidar(req, res, next, esquema);
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


