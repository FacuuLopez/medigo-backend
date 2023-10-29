import { Router } from "express";
import consultasController from "../controladores/consultas.js";
import { validarValoracionMedico } from "../validadores/consultas.js";

const consultasMedicosRutas = Router();
const consultaController = new consultasController();

consultasMedicosRutas.post(
  "/aceptar-consulta",
  consultaController.aceptarConsulta
);
consultasMedicosRutas.put(
  "/cancelar-consulta",
  consultaController.cancelarConsultaMedico
);
consultasMedicosRutas.put(
  "/rechazar-consulta",
  consultaController.rechazarConsulta
);
consultasMedicosRutas.get(
  "/solicitar-consulta",
  consultaController.solicitarConsultaMedico
);
consultasMedicosRutas.get(
  "/solicitar-estado-ultima-consulta",
  consultaController.solicitarEstadoUltimaConsultaMedico
);
consultasMedicosRutas.put(
  "/finalizar-consulta",
  consultaController.finalizarConsulta
);
consultasMedicosRutas.put(
  "/valorar-consulta",
  validarValoracionMedico,
  consultaController.valorarConsultaMedico
);
consultasMedicosRutas.get(
  "/historialConsultas",
  consultaController.historialConsultasMedico
);
export default consultasMedicosRutas;
