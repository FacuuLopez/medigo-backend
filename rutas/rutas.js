import { Router } from "express";
import usuariosRutas from "./usuarios.js";
import clientesRutas from "./clientes.js";
import medicosRutas from "./medicos.js";
import EspecialidadesController from "../controladores/especialidades.js";

const especialidadesController = new EspecialidadesController(); 

const rutas = Router();

rutas.use('/usuarios', usuariosRutas);
rutas.use('/clientes', clientesRutas);
rutas.use('/medicos', medicosRutas);
rutas.get('/especialidades', especialidadesController.devolverEspecialidades);

export default rutas;