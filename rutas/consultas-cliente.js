import { Router } from "express";
import consultasController from "../controladores/consultas.js";
import { validarCliente } from "../validadores/clientes.js";

const consultasClientesRutas = Router();
const consultaController = new consultasController();

consultasClientesRutas.use(validarCliente);

consultasClientesRutas.post('solicitar-consulta', consultaController.solicitarConsulta);
consultasClientesRutas.post('seleccionar-medico', consultaController.seleccionarMedicoConsulta);
consultasClientesRutas.delete('cancelar-consulta', consultaController.cancelarConsulta);
consultasClientesRutas.put('finalizar-consulta', consultaController.finalizarConsulta);
consultasClientesRutas.put('valorar-consulta', consultaController.valorarConsulta);

export default consultasClientesRutas;