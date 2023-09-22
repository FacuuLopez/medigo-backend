import { middlewareValidar } from "./index.js";
import { tokenUsuarioSchema } from "./esquemas/usuarios";

export const validarTokenUsuario = async (req, res, next) => {
    await middlewareValidar(req, res, next, tokenUsuarioSchema);
    return
}