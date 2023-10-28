import { Router } from "express";
import consultasController from "../controladores/consultas.js";
import { validarValoracionMedico } from "../validadores/consultas.js";

const consultasMedicosRutas = Router();
const consultaController = new consultasController();


consultasMedicosRutas.post('/aceptar-consulta', consultaController.aceptarConsulta);
consultasMedicosRutas.put('/cancelar-consulta', consultaController.cancelarConsulta);
consultasMedicosRutas.put('/rechazar-consulta', consultaController.rechazarConsulta);
consultasMedicosRutas.put('/finalizar-consulta', consultaController.finalizarConsulta);
consultasMedicosRutas.put('/valorar-consulta', validarValoracionMedico, consultaController.valorarConsultaMedico);
consultasMedicosRutas.get('/historialConsultas',consultaController.historialConsultasMedico )
export default consultasMedicosRutas;