import Consulta from '../modelos/consulta.js'; 
import medico from '../modelos/medico.js';
import { ENUM_CONSULTA_ESTADOS, ENUM_MEDICO_ESPECIALIDADES } from '../utils/enums.js';

const crearConsultas = async () => {
  try {
    const numConsultas = 40;
    const especialidades = Object.values(ENUM_MEDICO_ESPECIALIDADES);
    const estados = Object.values(ENUM_CONSULTA_ESTADOS);

    for (let i = 1; i <= numConsultas; i++) {
      const motivo = `motivo ${i}`;
      const sintomas = `síntomas ${i}`;
      const precio = 1200 + (2 * i);
      const tiempoLLegada = 20 + (2 * i);
      const estado = estados[Math.floor(Math.random() * estados.length)];
      const especialidad = especialidades[Math.floor(Math.random() * especialidades.length)];
      const valoracionMedico = 5;
      const comentarioDelMedico = `comentario médico ${i}`;
      const valoraciónCliente = 5;
      const comentarioDelCliente = `comentario cliente ${i}`;
      const direccion = `Calle-${i}`;

      const clienteId = 1;
      const personaId = 1;

      // Consultar la lista de médicos disponibles en la base de datos
      const medicos = await medico.findAll();

      // Seleccionar un médico aleatorio de la lista
      const medicoAleatorio = medicos[Math.floor(Math.random() * medicos.length)];

      // Obtener el ID del médico aleatorio
      const medicoId = medicoAleatorio.id;

      // Verificar si el médico ya tiene una consulta en curso
      const consultaEnCurso = await Consulta.findOne({
        where: {
          medicoId,
          estado: ENUM_CONSULTA_ESTADOS.enCurso
        }
      });

      if (consultaEnCurso) {
        console.log(`El médico con ID ${medicoId} ya tiene una consulta en curso.`);
        // Puedes registrar un mensaje o realizar otras acciones aquí
      } else {
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
          valoraciónCliente,
          comentarioDelCliente,
          direccion,
          clienteId,
          medicoId,
          personaId
        });
      }
    }

    console.log('Consultas creadas exitosamente');
  } catch (error) {
    console.log(error.message);
  }
}

export default crearConsultas;
