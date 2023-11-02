import Consulta from "../modelos/consulta.js";
import medico from "../modelos/medico.js";
import cliente from "../modelos/cliente.js"; // Asegúrate de importar el modelo de cliente si aún no lo has hecho.
import {
  ENUM_CONSULTA_ESTADOS,
  ENUM_MEDICO_ESPECIALIDADES,
} from "../utils/enums.js";

const crearConsultas = async () => {
  try {
    const especialidades = Object.values(ENUM_MEDICO_ESPECIALIDADES);

    // Crear consultas para cada uno de los 20 clientes
    for (let i = 1; i <= 20; i++) {
      const motivo = `motivo ${i}`;
      const sintomas = `síntomas ${i}`;
      const precio = 1200 + 2 * i;
      const tiempoLLegada = 20 + 2 * i;
      const especialidad =
        especialidades[Math.floor(Math.random() * especialidades.length)];
      const valoracionMedico = 5;
      const comentarioDelMedico = `comentario médico ${i}`;
      const valoraciónCliente = 5;
      const comentarioDelCliente = `comentario cliente ${i}`;
      const direccion = `Calle-${i}`;
      const clienteId = i;
      const personaId = i * 2;
      const medicoId = 1;
      const observacion = `observacion ${i}`;
      const FechaYHoraDeSeleccionandoMedico = null;

      let estado;

      switch (i) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
          estado = ENUM_CONSULTA_ESTADOS.seleccionandoMedico;
          break;
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
          estado = ENUM_CONSULTA_ESTADOS.solicitandoMedico;
          break;
        case 11:
        case 12:
        case 13:
        case 14:
        case 15:
          estado = ENUM_CONSULTA_ESTADOS.calificando;
          break;
        case 16:
        case 17:
        case 18:
        case 19:
        case 20:
          estado = ENUM_CONSULTA_ESTADOS.enCurso;
          break;
        default:
          estado = ENUM_CONSULTA_ESTADOS.cancelada;
          break;
      }

      // Crear la consulta principal para este cliente
      await Consulta.create({
        motivo,
        sintomas,
        precio,
        tiempoLLegada,
        estado,
        especialidad,
        valoracionMedico,
        comentarioDelMedico,
        valoraciónCliente,
        comentarioDelCliente,
        direccion,
        observacion,
        FechaYHoraDeSeleccionandoMedico,
        clienteId,
        medicoId,
        personaId,
      });

      // Crear consultas "rechazada" y "finalizada" para este cliente
      await Consulta.create({
        motivo,
        sintomas,
        precio,
        tiempoLLegada,
        estado: ENUM_CONSULTA_ESTADOS.rechazada,
        especialidad,
        valoracionMedico,
        comentarioDelMedico,
        valoraciónCliente,
        comentarioDelCliente,
        direccion,
        observacion,
        FechaYHoraDeSeleccionandoMedico,
        clienteId,
        medicoId,
        personaId,
      });

      await Consulta.create({
        motivo,
        sintomas,
        precio,
        tiempoLLegada,
        estado: ENUM_CONSULTA_ESTADOS.finalizada,
        especialidad,
        valoracionMedico,
        comentarioDelMedico,
        valoraciónCliente,
        comentarioDelCliente,
        direccion,
        observacion,
        FechaYHoraDeSeleccionandoMedico,
        clienteId,
        medicoId,
        personaId,
      });

      // Crear consultas "cancelada" para este cliente
      await Consulta.create({
        motivo,
        sintomas,
        precio,
        tiempoLLegada,
        estado: ENUM_CONSULTA_ESTADOS.cancelada,
        especialidad,
        valoracionMedico,
        comentarioDelMedico,
        valoraciónCliente,
        comentarioDelCliente,
        direccion,
        observacion,
        FechaYHoraDeSeleccionandoMedico,
        clienteId,
        medicoId,
        personaId,
      });
    }

    console.log("Consultas creadas exitosamente");
  } catch (error) {
    console.log(error.message);
  }
};

export default crearConsultas;
