import { Router } from "express";
import usuariosController from "../controladores/usuarios.js";

const usuariosRutas = Router();
const usuarioController = new usuariosController();

usuariosRutas.post("/login", usuarioController.login);

export default usuariosRutas;