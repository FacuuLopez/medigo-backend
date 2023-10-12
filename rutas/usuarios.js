import { Router } from "express";
import usuariosController from "../controladores/usuarios.js";
import { validarTokenUsuario, validarUsername } from "../validadores/usuarios.js";

const usuariosRutas = Router();
const usuarioController = new usuariosController();

usuariosRutas.post("/register", validarUsername, usuarioController.createUsuario);
usuariosRutas.post("/login", usuarioController.login);
usuariosRutas.get("/:id", usuarioController.getUsuarioPorId);

export default usuariosRutas;