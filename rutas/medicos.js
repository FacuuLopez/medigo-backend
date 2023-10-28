import { Router } from "express";
import medicosController from "../controladores/medicos.js";
import { validarUsuario } from "../validadores/usuarios.js";
import { validarMedico } from "../validadores/medicos.js";
import consultasMedicosRutas from "./consultas-medicos.js";

const medicosRutas = Router();
const medicoController = new medicosController();

medicosRutas.get("/especialidades", medicoController.getEspecialidades);
medicosRutas.post("/registro", medicoController.createMedico);

medicosRutas.use(validarUsuario); // no borrar ni cambiar el orden, verifica que sea un usuario quien hace la consulta
medicosRutas.use(validarMedico);
medicosRutas.put("/actualizar-datos", medicoController.updateMedicoPorId);
medicosRutas.put("/actualizar-estado", medicoController.actualizarEstadoMedico);
medicosRutas.use("/consultas", consultasMedicosRutas);

export default medicosRutas;
