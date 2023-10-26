import Consulta from '../modelos/consulta.js'; 
import { ENUM_CONSULTA_ESTADOS, ENUM_MEDICO_ESPECIALIDADES } from '../utils/enums.js';

 const crearConsultas = async () => {
  try {
    const numConsultas = 20;

    for (let i = 1; i <= numConsultas; i++) {
      const motivo = `motivo ${i}`;
      const sintomas = `sintomas ${i}`;
      const precio = 1200 + (2 * i);
      const tiempoLLegada = 20 + (2 * i);
      const estado = ENUM_CONSULTA_ESTADOS.finalizada; 
      const especialidad = ENUM_MEDICO_ESPECIALIDADES.clinico;
      const valoracionMedico = 5;
      const comentarioDelMedico = `comentario medico ${i}`;
      const valoracionCliente = 5;
      const comentarioDelCliente = `comentario cliente ${i}`; 
      const direccion = `Calle-${i}`;

      const clienteId = 1;
      const medicoId = 1;
      const personaId = 1;

      // Crear una nueva consulta en la base de datos
      await Consulta.create({
        motivo,
        sintomas,
        precio,
        tiempoLLegada,
        estado, 
        especialidad,
        valoracionMedico,       
        comentarioDelMedico,
        valoracionCliente,
        comentarioDelCliente, 
        direccion,
        clienteId,
        medicoId,
        personaId
      });
    }

    console.log('Consultas creadas exitosamente');
  } catch (error) {
    console.log(error.message);
  }
}

export default crearConsultas;