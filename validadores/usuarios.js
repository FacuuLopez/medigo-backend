import { middlewareValidar } from "./index.js";
import { tokenUsuarioSchema } from "./esquemas/usuarios.js";

export const validarTokenUsuario = async (req, res, next) => {
    const esquema = { tokenUsuario: tokenUsuarioSchema };
    await middlewareValidar(req, res, next, esquema);
    return
}