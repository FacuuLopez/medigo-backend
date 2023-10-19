import { Router } from "express";
import consultasController from "../controladores/consultas.js";
import { validarValoracionMedico } from "../validadores/consultas.js";

const consultasMedicosRutas = Router();
const consultaController = new consultasController();


consultasMedicosRutas.post('/aceptar-consulta', consultaController.aceptarConsulta);
consultasMedicosRutas.delete('/cancelar-consulta', consultaController.cancelarConsulta);
consultasMedicosRutas.put('/finalizar-consulta', consultaController.finalizarConsulta);
consultasMedicosRutas.put('/valorar-consulta', validarValoracionMedico, consultaController.valorarConsultaMedico);

export default consultasMedicosRutas;