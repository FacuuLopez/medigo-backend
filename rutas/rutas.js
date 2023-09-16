import { Router } from "express";
import usuariosRutas from "./usuarios";
import clientesRutas from "./clientes";
import medicosRutas from "./medicos";
import consultasRutas from "./consultas-cliente";

const rutas = Router();

rutas.use('/usuarios', usuariosRutas);
rutas.use('/clientes', clientesRutas);
rutas.use('/medicos', medicosRutas);

export default rutas;