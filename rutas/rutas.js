import { Router } from "express";
import usuariosRutas from "./usuarios.js";
import clientesRutas from "./clientes.js";
import medicosRutas from "./medicos.js";

const rutas = Router();

rutas.use('/usuarios', usuariosRutas);
rutas.use('/clientes', clientesRutas);
rutas.use('/medicos', medicosRutas);

export default rutas;