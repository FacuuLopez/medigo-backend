import { Router } from "express";
import clientesController from "../controladores/clientes.js";
import consultasClientesRutas from "./consultas-cliente.js";
import { validarUsuario } from "../validadores/usuarios.js";

const clientesRutas = Router();
const clienteController = new clientesController();

clientesRutas.post('/registro', clienteController.createCliente);

clientesRutas.use(validarUsuario); // no borrar ni cambiar el orden, verifica que sea un usuario quien hace la consulta
clientesRutas.use('/consultas', consultasClientesRutas)



export default clientesRutas;