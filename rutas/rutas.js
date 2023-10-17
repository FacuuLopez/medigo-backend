import { Router } from "express";
import usuariosRutas from "./usuarios.js";
import clientesRutas from "./clientes.js";
import medicosRutas from "./medicos.js";
import consultasClientesRutas from "./consultas-cliente.js";

const rutas = Router();

rutas.use('/usuarios', usuariosRutas);
rutas.use('/clientes', clientesRutas);
rutas.use('/medicos', medicosRutas);
rutas.use('/consultas-cliente', consultasClientesRutas)

export default rutas;