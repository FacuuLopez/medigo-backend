import { Router } from "express";
import clientesController from "../controladores/clientes.js";
import consultasClientesRutas from "./consultas-cliente.js";

const clientesRutas = Router();
const clienteController = new clientesController();

clientesRutas.use('consultas', consultasClientesRutas)

clientesRutas.post('/registro', clienteController.createCliente);

export default clientesRutas;