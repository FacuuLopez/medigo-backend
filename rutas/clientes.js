import { Router } from "express";
import clientesController from "../controladores/clientes.js";
import { validarUsuario } from "../validadores/usuarios.js";
import { validarCliente } from "../validadores/clientes.js";
import consultasClientesRutas from "./consultas-cliente.js";

const clientesRutas = Router();
const clienteController = new clientesController();

clientesRutas.post("/registro", clienteController.createCliente);

clientesRutas.use(validarUsuario); // no borrar ni cambiar el orden, verifica que sea un usuario quien hace la consulta
clientesRutas.use(validarCliente);
clientesRutas.put("/actualizar-datos", clienteController.updateClientePorId);
clientesRutas.put(
  "/eliminar-miembro",
  clienteController.eliminarMiembroFamiliar
);
clientesRutas.post(
  "/agregar-miembro",
  clienteController.agregarMiembroFamiliar
);
clientesRutas.put(
  "/modificar-miembro",
  clienteController.modificarMiembroFamiliar
);

clientesRutas.use("/consultas", consultasClientesRutas);

export default clientesRutas;
