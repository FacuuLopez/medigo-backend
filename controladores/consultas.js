import { consulta, persona, usuario, medico } from "../modelos/index.js";
import {
  ENUM_CONSULTA_ESTADOS,
  ENUM_MEDICO_ESPECIALIDADES,
  ENUM_USUARIO_ESTADOS,
} from "../utils/enums.js";

const DISTANCIA_MAXIMA_M = 1500;

/**
 * Calcula la distancia entre dos puntos geográficos.
 */
const calcularDistancia = (x1, y1, x2, y2) => {
  const rad1 = {
    x: x1 * (Math.PI / 180),
    y: y1 * (Math.PI / 180),
  };
  const rad2 = {
    x: x2 * (Math.PI / 180),
    y: y2 * (Math.PI / 180),
  };

  deltaX = rad1.x - rad2.x;
  deltaY = rad1.y - rad2.y;

  // Se aplica la fórmula del semiverseno
  // https://es.wikipedia.org/wiki/Fórmula_del_semiverseno
  const a =
    Math.sin(deltaX / 2) ** 2 +
    Math.cos(rad1.x) * Math.cos(rad2.x) * Math.sin(deltaY / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const RADIO_TIERRA_KM = 6371;

  return RADIO_TIERRA_KM * c * 1000;
};

class consultasController {
  constructor() {}

  solicitarConsulta = async (req, res, next) => {
    // se valida en los validadores/consulta que no exista otra consulta para ese cliente con estado "en curso"
    try {
      const { id: clienteId } = req.cliente;
      //console.log('ID del cliente:', clienteId);
      const {
        sintomas,
        motivo,
        especialidad,
        latitud,
        longitud,
        nombre,
        apellido,
        direccion,
      } = req.body;

      await consulta.create({
        clienteId,
        sintomas,
        motivo,
        direccion,
        estado: ENUM_CONSULTA_ESTADOS.solicitandoMedico,
        especialidad,
      });

      let medicosDisponibles = await medico.findAll({
        include: [
          {
            model: usuario,
            include: [persona], // Si también quieres incluir el modelo Persona dentro del modelo Usuario
          },
        ],
        where: {
          especialidad,
        },
      });

      medicosDisponibles = medicosDisponibles
        .filter(
          (medico) => medico.usuario.estado == ENUM_USUARIO_ESTADOS.conectado
        )
        /* TODO: Descomentar cuando se implementen las coordenadas
                .sort((medicoA, medicoB) =>
                    calcularDistancia(
                        latitud,
                        longitud,
                        medicoA.latitud, // TODO: Revisar las ubicaciones
                        medicoA.longitud  // TODO: Revisar las ubicaciones
                    ) -
                    calcularDistancia(
                        latitud,
                        longitud,
                        medicoB.latitud, // TODO: Revisar las ubicaciones
                        medicoB.longitud  // TODO: Revisar las ubicaciones
                    )
                );*/
        .map((medico) => ({
          nroMatricula: medico.nroMatricula,
          nombre: medico.usuario.persona.nombre,
          apellido: medico.usuario.persona.apellido,
          especialidad: medico.especialidad,
          tiempo: 500, // TODO: Calcualar según ubicación
          precio: medico.precio,
          valoracion: medico.usuario.valoracion,
          resenas: 0, // TODO: Implementar reseñas
          comentarios: [], // TODO: Implementar comentarios
        }));
      /*
       * TODO: Falta filtrar los médicos cuando distancia > radioAccion.
       *       Esto falta porque en el modelo de médicos todavía no se
       *       modificó cómo se guardan las coordenadas
       */

      res.status(200).json(medicosDisponibles);
    } catch (error) {
      res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  };

  seleccionarMedicoConsulta = async (req, res, next) => {
    try {
      const { id: consultaId } = req.consulta; // hay que agregarla cuando se valida
      //tiene que ser la unica consulta para ese clienteId con estado 'seleccionando medico'
      const { medicoId } = req.body;
      const medicoElegido = await medico.findByPk(medicoId);
      const { precio } = medicoElegido.dataValues;
      const tiempoLLegada = null; // aca necesitamos calcular a que hora se estima que llega el medico
      const iniciarConsulta = await consulta.findByPk(consultaId);
      const consultaIniciada = await iniciarConsulta.update({
        medicoId,
        precio,
        tiempoLLegada,
        estado: ENUM_CONSULTA_ESTADOS.seleccionandoMedico,
      });
      res.status(200).json({
        message: "consulta iniciada con exito",
        consulta: consultaIniciada.dataValues,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("no se pudo iniciar la consutla");
    }
  };


  aceptarConsulta = async (req, res, next) => {
    try {
      const { consultaId } = req.body;
      const consultaAceptada = await consulta.findByPk(consultaId);
      await consultaAceptada.update({
        
        estado: ENUM_CONSULTA_ESTADOS.enCurso,
      });
      res.status(200).send("consulta aceptada");
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  rechazarConsulta = async (req, res, next) => {
    try {
      const { consultaId } = req.body;
      const consultaAceptada = await consulta.findByPk(consultaId);
      await consultaAceptada.update({
        estado: ENUM_CONSULTA_ESTADOS.rechazada,
      });
      res.status(200).send(
        { mensaje: "consulta rechazada",
         estado: ENUM_CONSULTA_ESTADOS.rechazada
        }
         );
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  cancelarConsulta = async (req, res, next) => {
    try {
      const { id: medicoId } = req.medico; // Obtenemos el ID del médico desde el token
      console.log('ID del médico:', medicoId);

      const consultaEnCurso = await consulta.findOne({
        where: {
          medicoId: medicoId,
          estado: ENUM_CONSULTA_ESTADOS.enCurso
        },
      });
  
      console.log('Consulta encontrada:', consultaEnCurso);

      if (consultaEnCurso) {
    
        await consultaEnCurso.update({
          estado: ENUM_CONSULTA_ESTADOS.cancelada,
        });
        //console.log('Consulta actualizada:', consultaEnCurso); // Agrega esta línea de registro
        res.status(200).json({ message: "Consulta en curso cancelada con éxito" });
      } else {
        
        //console.log('Consulta no encontrada:', consultaEnCurso); // Agrega esta línea de registro
        res.status(404).json({
          message: "No se encontró ninguna consulta en curso para este médico",
        });
      }
    } catch (error) {
      //console.error(error); // Registra el error en la consola
      res.status(500).json({ error: "Error al cancelar la consulta en curso" });
    }
  };
  
  finalizarConsulta = async (req, res, next) => {
    try {
      const { consultaId } = req.body;
      const consultaFinalizada = await consulta.findByPk(consultaId);
      await consultaFinalizada.update({
        estado: ENUM_CONSULTA_ESTADOS.finalizada,
      });
      res.status(200).send("consulta finalizada");
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  valorarConsultaCliente = async (req, res, next) => {
    const { consultaId, valoracionMedico } = req.consulta; // hay que agregarla cuando se valida
    //tiene que ser la unica consulta para ese clienteId con estado 'en curso'
    const { valoracion, comentario } = req.body;
    try {
      const consultaValorada = await consulta.findByPk(consultaId);
      valoracionMedico
        ? await consultaValorada.update({
            valoracionCliente: valoracion,
            comentarioDelCliente: comentario,
            estado: ENUM_CONSULTA_ESTADOS.finalizada,
          })
        : await consultaValorada.update({
            valoracionCliente: valoracion,
            comentarioDelCliente: comentario,
          });

      res.status(200).send("consulta valorada");
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  valorarConsultaMedico = async (req, res, next) => {
    const { consultaId, valoracionCliente } = req.consulta; // hay que agregarla cuando se valida
    //tiene que ser la unica consulta para ese clienteId con estado 'calificando'
    const { valoracion, comentario } = req.body;
    try {
      const consultaValorada = await consulta.findByPk(consultaId);

      valoracionCliente
        ? await await consultaValorada.update({
            valoracionMedico: valoracion,
            comentarioDelMedico: comentario,
            estado: ENUM_CONSULTA_ESTADOS.finalizada,
          })
        : await consultaValorada.update({
            valoracionMedico: valoracion,
            comentarioDelMedico: comentario,
          });

      res.status(200).send("consulta valorada");
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  historialConsultasMedico = async (req, res, next) => {
    try {
      const { id } = req.medico;
      console.log('ID del médico:', id);
      const listaConsultas = await consulta.findAll({
        attributes: ["precio", "createdAt", "valoracionCliente", "direccion"],
        include: {
          model: persona,
          attributes: ["nombre", "apellido"],
        },
        where: {
          medicoId: id,
        },
      });

      res.status(200).send({
        success: true,
        message: "Consultas encontradas",
        result: listaConsultas,
      });
    } catch (error) {
      console.error(error);
      res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  };

  historialConsultasCliente = async (req, res, next) => {
    try {
      const { id } = req.cliente;
      const listaConsultas = await consulta.findAll({
        attributes: ["precio", "createdAt", "valoracionMedico", "direccion"],
        include: {
          model: persona,
          attributes: ["nombre", "apellido"],
          model: medico,
          attributes: ["especialidad"],
          include: {
            model: usuario,
            include: {
              model: persona,
              attributes: ["nombre", "apellido"],
            },
          },
        },
        where: {
          clienteId: id,
        },
      });

      res.status(200).send({
        success: true,
        message: "Consultas encontradas",
        result: listaConsultas,
      });
    } catch (error) {
      console.error(error);
      res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  };

  getEspecialidades = async (req, res, next) => {
    try {
      const especialidades = [
        ENUM_MEDICO_ESPECIALIDADES.clinico,
        ENUM_MEDICO_ESPECIALIDADES.pediatra,
      ];
      res.status(200).send({
        success: true,
        message: "Especialidades encontradas",
        result: especialidades,
      });
    } catch (error) {
      console.error(error);
      res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  };
}

export default consultasController;
