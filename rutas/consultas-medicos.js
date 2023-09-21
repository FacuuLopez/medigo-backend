import { Router } from "express";
import consultasController from "../controladores/consultas.js";
import { validarMedico } from "../validadores/medicos.js";

const consultasMedicosRutas = Router();
const consultaController = new consultasController();

consultasMedicosRutas.use(validarMedico);

consultasMedicosRutas.post('aceptar-consulta', consultaController.aceptarConsulta);
consultasMedicosRutas.delete('cancelar-consulta', consultaController.cancelarConsulta);
consultasMedicosRutas.put('finalizar-consulta', consultaController.finalizarConsulta);
consultasMedicosRutas.put('valorar-consulta', consultaController.valorarConsulta);

export default consultasMedicosRutas;