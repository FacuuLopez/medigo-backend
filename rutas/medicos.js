import { Router } from "express";
import medicosController from "../controladores/medicos";
import consultasMedicosRutas from "./consultas-medicos";

const medicosRutas = Router();
const medicoController = new medicosController();

medicosRutas.use('consultas', consultasMedicosRutas)

medicosRutas.post('/registro', medicoController.registro);

export default medicosRutas;