import { Router } from "express";
import medicosController from "../controladores/medicos.js";
import consultasMedicosRutas from "./consultas-medicos.js";

const medicosRutas = Router();
const medicoController = new medicosController();

medicosRutas.use('/consultas', consultasMedicosRutas)

medicosRutas.post('/registro', medicoController.createMedico);

export default medicosRutas;