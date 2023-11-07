import { Router } from "express";
import consultasController from "../controladores/consultas.js";
import {
  validarSeleccionarMedicoConsulta,
  validarValorarConsultaCliente,
} from "../validadores/consultas.js";

const consultasClientesRutas = Router();
const consultaController = new consultasController();

consultasClientesRutas.post(
  "/solicitar-consulta",
  consultaController.solicitarConsulta
);
consultasClientesRutas.post(
  "/seleccionar-medico",
  validarSeleccionarMedicoConsulta,
  consultaController.seleccionarMedicoConsulta
);
consultasClientesRutas.put(
  "/cancelar-consulta",
  consultaController.cancelarConsultaCliente
);
// consultasClientesRutas.put(
//   "/finalizar-consulta",
//   consultaController.finalizarConsulta
// );
consultasClientesRutas.put(
  "/valorar-consulta",
  validarValorarConsultaCliente,
  consultaController.valorarConsultaCliente
);
consultasClientesRutas.get(
  "/historialConsultas",
  consultaController.historialConsultasCliente
);
consultasClientesRutas.get(
  "/especialidades",
  consultaController.getEspecialidades
);
consultasClientesRutas.get(
  "/solicitar-estado-ultima-consulta",
  consultaController.solicitarEstadoUltimaConsultaCliente
);
export default consultasClientesRutas;
