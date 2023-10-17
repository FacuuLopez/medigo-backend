import { Router } from "express";
import medicosController from "../controladores/medicos.js";
import consultasMedicosRutas from "./consultas-medicos.js";
import { validarUsuario } from "../validadores/usuarios.js";

const medicosRutas = Router();
const medicoController = new medicosController();

medicosRutas.post('/registro', medicoController.createMedico);

medicosRutas.use(validarUsuario); // no borrar ni cambiar el orden, verifica que sea un usuario quien hace la consulta
medicosRutas.use('/consultas', consultasMedicosRutas)



export default medicosRutas;