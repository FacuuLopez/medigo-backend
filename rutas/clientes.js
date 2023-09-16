import { Router } from "express";
import clientesController from "../controladores/clientes";

const clientesRutas = Router();
const clienteController = new clientesController();

clientesRutas.use('consultas', consultasClientesRutas)

clientesRutas.post('/registro', clienteController.registro);

export default clientesRutas;