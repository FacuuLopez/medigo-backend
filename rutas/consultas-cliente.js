import { Router } from "express";
import consultasController from "../controladores/consultas.js";
import { validarCliente } from "../validadores/clientes.js";
import { validarSeleccionarMedicoConsulta, validarValorarConsultaCliente } from "../validadores/consultas.js";

const consultasClientesRutas = Router();
const consultaController = new consultasController();

consultasClientesRutas.use(validarCliente);

consultasClientesRutas.post('/solicitar-consulta', consultaController.solicitarConsulta);
consultasClientesRutas.post('/seleccionar-medico', validarSeleccionarMedicoConsulta, consultaController.seleccionarMedicoConsulta);
consultasClientesRutas.delete('/cancelar-consulta', consultaController.cancelarConsulta);
consultasClientesRutas.put('/finalizar-consulta', consultaController.finalizarConsulta);
consultasClientesRutas.put('/valorar-consulta', validarValorarConsultaCliente, consultaController.valorarConsultaCliente);

export default consultasClientesRutas;