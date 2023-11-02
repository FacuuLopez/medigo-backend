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
      const { id: clienteId } = req.cliente;
      const { nroMatricula } = req.body;
      console.log("id", clienteId);

      const consultaDePaciente = await consulta.findOne({
        where: {
          clienteId,
          estado: ENUM_CONSULTA_ESTADOS.seleccionandoMedico,
        },
      });

      const medicoEncontrado = await medico.findOne({
        where: {
          nroMatricula,
        },
      });

      if (consultaDePaciente && medicoEncontrado) {
        // Obtener la fecha y hora actual
        const currentDateTime = new Date();
        console.log("Medico encontrado = ", medicoEncontrado);

        // Actualizar la consulta con el médico y la fecha y hora
        await consultaDePaciente.update({
          estado: ENUM_CONSULTA_ESTADOS.solicitandoMedico,
          medicoId: medicoEncontrado.id,
          FechaYHoraDeSeleccionandoMedico: currentDateTime,
        });

        res.status(200).json({
          message: "Agregado médico a consulta con éxito",
          estado: ENUM_CONSULTA_ESTADOS.seleccionandoMedico,
        });
      } else {
        res.status(404).json({
          message:
            "No se encontró ninguna consulta en seleccionando médico con ese cliente",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send("No se pudo iniciar la consulta");
    }
  };

  // seleccionarMedicoConsulta = async (req, res, next) => {
  //   try {
  //     const { id: clienteId } = req.cliente;
  //     const { nroMatricula } = req.body;

  //     const consultaDePaciente = await consulta.findOne({
  //       where: {
  //         clienteId,
  //         estado: ENUM_CONSULTA_ESTADOS.seleccionandoMedico,
  //       },
  //     });

  //     const medicoEncontrado = await medico.findOne({
  //       where: {
  //         nroMatricula,
  //       },
  //     });

  //     if (consultaDePaciente && medicoEncontrado) {
  //       await consultaDePaciente.update({
  //         estado: ENUM_CONSULTA_ESTADOS.solicitandoMedico,
  //         medicoId: medico.medicoId,
  //       });

  //       res.status(200).json({
  //         message: "Agregado medico a consulta con exito",
  //         esatdo: ENUM_CONSULTA_ESTADOS.seleccionandoMedico,
  //       });
  //     } else {
  //       res.status(404).json({
  //         message:
  //           "No se encontró ninguna consulta en seleccionando medico con ese cliente",
  //       });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).send("no se pudo iniciar la consutla");
  //   }
  // };

  solicitarConsultaMedico = async (req, res, next) => {
    try {
      const { id: medicoId } = req.medico;

      const consultaDeMedico = await consulta.findOne({
        where: {
          medicoId,
          estado: ENUM_CONSULTA_ESTADOS.solicitandoMedico,
        },
      });

      const usuarioDeLaConsulta = await persona.findOne({
        where: {
          id: consultaDeMedico.personaId,
        },
      });

      const resultFinal = {};
      resultFinal.motivo = consultaDeMedico.motivo;
      resultFinal.sintomas = consultaDeMedico.sintomas;
      resultFinal.precio = consultaDeMedico.precio;
      resultFinal.tiempoLlegada = consultaDeMedico.tiempoLlegada;
      resultFinal.estado = consultaDeMedico.estado;
      resultFinal.especialidad = consultaDeMedico.especialidad;
      resultFinal.valoracionMedico = consultaDeMedico.valoracionMedico;
      resultFinal.valoracionCliente = consultaDeMedico.valoracionCliente;
      resultFinal.comentarioDelCliente = consultaDeMedico.comentarioDelCliente;
      resultFinal.comentarioDelMedico = consultaDeMedico.comentarioDelMedico;
      resultFinal.direccion = consultaDeMedico.direccion;
      resultFinal.observacion = consultaDeMedico.observacion;
      resultFinal.createdAt = consultaDeMedico.createdAt;
      resultFinal.updateAt = consultaDeMedico.updateAt;
      resultFinal.nombre = usuarioDeLaConsulta.nombre;
      resultFinal.apellido = usuarioDeLaConsulta.apellido;
      resultFinal.sexo = usuarioDeLaConsulta.sexo;
      resultFinal.fechaNacimiento = usuarioDeLaConsulta.fechaNacimiento;

      res.status(200).json({
        success: true,
        message: "Consulta",
        result: resultFinal,
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  aceptarConsulta = async (req, res, next) => {
    try {
      const { id: medicoId, usuarioId } = req.medico;

      const consultaDeMedico = await consulta.findOne({
        where: {
          medicoId,
          estado: ENUM_CONSULTA_ESTADOS.solicitandoMedico,
        },
      });

      const usuarioEncontrado = await usuario.findOne({
        where: {
          id: usuarioId,
        },
      });

      if (consultaDeMedico && usuarioEncontrado) {
        await consultaDeMedico.update({
          estado: ENUM_CONSULTA_ESTADOS.enCurso,
        });

        await usuarioEncontrado.update({
          estado: ENUM_USUARIO_ESTADOS.desconectado,
        });

        res.status(200).send({
          message: "consulta aceptada",
          state: ENUM_CONSULTA_ESTADOS.enCurso,
          user: ENUM_USUARIO_ESTADOS.desconectado,
        });
      } else {
        res.status(400).send({
          success: false,
          message: error.message,
        });
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  solicitarEstadoUltimaConsultaMedico = async (req, res, next) => {
    try {
      const { id: medicoId } = req.medico;

      const consultaDeMedico = await consulta.findOne({
        where: {
          medicoId,
        },
        order: [["createdAt", "DESC"]],
      });

      if (consultaDeMedico) {
        res.status(200).send({
          message: "Consulta",
          result: consultaDeMedico.estado,
        });
      } else {
        res.status(400).send({
          success: false,
          message: error.message,
        });
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  solicitarEstadoUltimaConsultaCliente = async (req, res, next) => {
    try {
      const { id: clienteId } = req.cliente;

      const consultaDeCliente = await consulta.findOne({
        where: {
          clienteId,
        },
        order: [["createdAt", "DESC"]],
      });

      if (consultaDeCliente) {
        res.status(200).send({
          message: "Consulta",
          result: consultaDeCliente.estado,
        });
      } else {
        res.status(400).send({
          success: false,
          message: error.message,
        });
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  rechazarConsulta = async (req, res, next) => {
    try {
      const { id: medicoId } = req.medico;

      const consultaDeMedico = await consulta.findOne({
        where: {
          medicoId,
          estado: ENUM_CONSULTA_ESTADOS.solicitandoMedico,
        },
      });

      if (consultaDeMedico) {
        await consultaDeMedico.update({
          estado: ENUM_CONSULTA_ESTADOS.seleccionandoMedico,
        });

        res.status(200).send({
          message: "consulta rechazada",
          state: ENUM_CONSULTA_ESTADOS.seleccionandoMedico,
        });
      } else {
        res.status(400).send({
          success: false,
          message: error.message,
        });
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  cancelarConsultaMedico = async (req, res, next) => {
    try {
      const { id: medicoId } = req.medico; // Obtenemos el ID del médico desde el token

      const consultaEnCurso = await consulta.findOne({
        where: {
          medicoId: medicoId,
          estado: ENUM_CONSULTA_ESTADOS.enCurso,
        },
      });

      if (consultaEnCurso) {
        await consultaEnCurso.update({
          estado: ENUM_CONSULTA_ESTADOS.cancelada,
        });
        //console.log('Consulta actualizada:', consultaEnCurso); // Agrega esta línea de registro
        res.status(200).json({
          message: "Consulta en curso cancelada con éxito",
          state: ENUM_CONSULTA_ESTADOS.cancelada,
        });
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

  cancelarConsultaCliente = async (req, res, next) => {
    try {
      const { id: clienteId } = req.cliente; // Obtenemos el ID del médico desde el token

      const consultaEnCurso = await consulta.findOne({
        where: {
          medicoId: clienteId,
          estado: ENUM_CONSULTA_ESTADOS.enCurso,
        },
      });

      if (consultaEnCurso) {
        await consultaEnCurso.update({
          estado: ENUM_CONSULTA_ESTADOS.cancelada,
        });
        //console.log('Consulta actualizada:', consultaEnCurso); // Agrega esta línea de registro
        res.status(200).json({
          message: "Consulta en curso cancelada con éxito",
          state: ENUM_CONSULTA_ESTADOS.cancelada,
        });
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
      const { id: medicoId } = req.medico;

      const consultaDeMedico = await consulta.findOne({
        where: {
          medicoId,
          estado: ENUM_CONSULTA_ESTADOS.enCurso,
        },
      });

      if (consultaDeMedico) {
        await consultaDeMedico.update({
          estado: ENUM_CONSULTA_ESTADOS.calificando,
        });

        res.status(200).send({
          message: "consulta en calificacion",
          state: ENUM_CONSULTA_ESTADOS.calificando,
        });
      } else {
        res.status(400).send({
          success: false,
          message: error.message,
        });
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  valorarConsultaCliente = async (req, res, next) => {
    try {
      const { id: clienteId } = req.cliente;
      const { valoracion, comentario } = req.body;

      const consultaDeCliente = await consulta.findOne({
        where: {
          clienteId,
          estado: ENUM_CONSULTA_ESTADOS.calificando,
        },
      });

      if (consultaDeCliente) {
        if (consultaDeCliente.valoracionMedico) {
          await consultaDeCliente.update({
            valoracionCliente: valoracion,
            comentarioDelCliente: comentario,
            estado: ENUM_CONSULTA_ESTADOS.finalizada,
          });
        } else {
          await consultaDeCliente.update({
            valoracionCliente: valoracion,
            comentarioDelCliente: comentario,
          });
        }
        res.status(200).send({
          message: "consulta en calificacion",
          state: ENUM_CONSULTA_ESTADOS.calificando,
        });
      } else {
        res.status(400).send({
          success: false,
          message: error.message,
        });
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  valorarConsultaMedico = async (req, res, next) => {
    try {
      const { id: medicoId } = req.medico;
      const { valoracion, comentario } = req.body;

      const consultaDeMedico = await consulta.findOne({
        where: {
          medicoId,
          estado: ENUM_CONSULTA_ESTADOS.calificando,
        },
      });

      if (consultaDeMedico) {
        if (consultaDeMedico.valoracionCliente) {
          await consultaDeMedico.update({
            valoracionMedico: valoracion,
            comentarioDelMedico: comentario,
            estado: ENUM_CONSULTA_ESTADOS.finalizada,
          });
        } else {
          await consultaDeMedico.update({
            valoracionMedico: valoracion,
            comentarioDelMedico: comentario,
          });
        }

        res.status(200).send({
          message: "consulta en calificacion",
          state: ENUM_CONSULTA_ESTADOS.calificando,
        });
      } else {
        res.status(400).send({
          success: false,
          message: error.message,
        });
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  };

  historialConsultasMedico = async (req, res, next) => {
    try {
      const { id } = req.medico;
      const listaConsultas = await consulta.findAll({
        attributes: [
          "precio",
          "createdAt",
          "valoracionCliente",
          "direccion",
          "observacion",
        ],
        include: {
          model: persona,
          attributes: ["nombre", "apellido"],
        },
        where: {
          medicoId: id,
          estado: ENUM_CONSULTA_ESTADOS.finalizada,
        },
      });

      const listaFinal = [];
      for (let i = 0; i < listaConsultas.length; i++) {
        const obj1 = listaConsultas[i];

        listaFinal[i] = {};
        listaFinal[i].precio = obj1.precio;
        listaFinal[i].createdAt = obj1.createdAt;
        listaFinal[i].valoracionCliente = obj1.valoracionCliente;
        listaFinal[i].direccion = obj1.direccion;
        listaFinal[i].observacion = obj1.observacion;
        listaFinal[i].nombre = obj1.persona.nombre;
        listaFinal[i].apellido = obj1.persona.apellido;
      }

      res.status(200).json({
        success: true,
        message: "Consultas encontradas",
        result: listaFinal,
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
        include: [
          {
            model: persona,
            attributes: ["nombre", "apellido"],
          },
          {
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
        ],
        where: {
          clienteId: id,
          estado: ENUM_CONSULTA_ESTADOS.finalizada,
        },
      });

      const listaFinal = [];
      for (let i = 0; i < listaConsultas.length; i++) {
        const obj1 = listaConsultas[i];

        listaFinal[i] = {};
        listaFinal[i].precio = obj1.precio;
        listaFinal[i].createdAt = obj1.createdAt;
        listaFinal[i].valoracionMedico = obj1.valoracionMedico;
        listaFinal[i].direccion = obj1.direccion;
        listaFinal[i].nombre = obj1.persona.nombre;
        listaFinal[i].apellido = obj1.persona.apellido;
        listaFinal[i].especialidad = obj1.medico.especialidad;
        listaFinal[i].nombreMedico = obj1.medico.usuario.persona.nombre;
        listaFinal[i].apellidoMedico = obj1.medico.usuario.persona.apellido;
      }

      res.status(200).send({
        success: true,
        message: "Consultas encontradas",
        result: listaFinal,
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

  agregarObservacionMedico = async (req, res, next) => {
    try {
      const { id: medicoId } = req.medico;
      const { observacion } = req.body;
      const consultaDeMedico = await consulta.findOne({
        where: {
          medicoId,
          estado: ENUM_CONSULTA_ESTADOS.enCurso,
        },
      });
      let result;

      if (
        consultaDeMedico.observacion != "" &&
        consultaDeMedico.observacion != null
      ) {
        const observacion1 =
          `${consultaDeMedico.observacion}` + " / " + observacion;
        result = consultaDeMedico.update({
          observacion: observacion1,
        });
      } else {
        result = await consultaDeMedico.update({ observacion });
      }
      res.status(200).send({
        success: true,
        message: "Observacion actualizada",
        result: consultaDeMedico.observacion,
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
