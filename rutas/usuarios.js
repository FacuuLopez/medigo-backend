import { Router } from "express";
import usuariosController from "../controladores/usuarios.js";
import { validarTokenUsuario } from "../validadores/usuarios.js";

const usuariosRutas = Router();
const usuarioController = new usuariosController();

usuariosRutas.post("/register", usuarioController.createUsuario);
usuariosRutas.post("/login", usuarioController.login);
usuariosRutas.get("/:id", usuarioController.getUsuarioPorId);

export default usuariosRutas;