import { Router } from "express";
import usuariosController from "../controladores/usuarios";
import { validarUsuario } from "../validadores/usuarios";

const usuariosRutas = Router();
const usuarioController = new usuariosController();

usuarioRoutes.post("/login", usuarioController.login);

usuariosRutas.use(validarUsuario);

usuarioRoutes.delete("/logout", usuarioController.logout);

export default usuariosRutas;