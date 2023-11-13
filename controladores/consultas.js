import {
  consulta,
  persona,
  usuario,
  medico,
  grupoFamiliar,
  cliente,
} from "../modelos/index.js";
import {
  ENUM_CONSULTA_ESTADOS,
  ENUM_MEDICO_ESPECIALIDADES,
  ENUM_USUARIO_ESTADOS,
} from "../utils/enums.js";
import { calcularDistanciaCalles } from "../utils/distancias.js";
import { Op } from "sequelize";

const MINUTOS_POR_CUADRA = 0.5;
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
        departamento,
        piso,
      } = req.body;

      const clienteEncontrado = await cliente.findOne({
        where: {
          id: clienteId,
        },
        include: [
          {
            model: grupoFamiliar,
            include: [
              {
                model: persona,
                where: {
                  nombre,
                  apellido,
                },
              },
            ],
          },
        ],
      });

      const { id: personaId } =
        clienteEncontrado.dataValues.grupoFamiliar.dataValues.personas[0]
          .dataValues;

      await consulta.create({
        clienteId,
        sintomas,
        motivo,
        direccion,
        departamento,
        piso,
        estado: ENUM_CONSULTA_ESTADOS.seleccionandoMedico,
        especialidad,
        personaId,
        latitudCLiente: latitud,
        longitudCliente: longitud,
      });

      let medicosDisponibles = await medico.findAll({
        include: [
          {
            model: usuario,
            include: [persona], // Si también quieres incluir el modelo Persona dentro del modelo Usuario
            where: {
              estado: ENUM_USUARIO_ESTADOS.conectado,
            },
          },
        ],
        where: {
          especialidad,
        },
      });

      medicosDisponibles = medicosDisponibles
        .map((medico) =>
          Object.assign(medico, {
            distancia: calcularDistanciaCalles(
              latitud,
              longitud,
              medico.latitud,
              medico.longitud
            ),
          })
        )
        .filter((medico) => medico.distancia <= Number(medico.radioAccion))
        .sort((medicoA, medicoB) => medicoA.distancia - medicoB.distancia)
        .map((medico) => ({
          nroMatricula: medico.nroMatricula,
          nombre: medico.usuario.persona.nombre,
          apellido: medico.usuario.persona.apellido,
          especialidad: medico.especialidad,
          precio: medico.precio,
          valoracion: medico.usuario.valoracion,
          resenas: medico.usuario.resenas, // TODO: Implementar reseñas
          comentarios: [], // TODO: Implementar comentarios
          tiempo: Math.round((medico.distancia / 100) * MINUTOS_POR_CUADRA),
          latitud: medico.latitud,
          longitud: medico.longitud,
        }));

      res.status(200).json({
        message: "Listado de medicos",
        result: medicosDisponibles,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  };

  seleccionarMedicoConsulta = async (req, res, next) => {
    try {
      const { id: clienteId } = req.cliente;
      const { nroMatricula, tiempoLlegada, horaEstimada } = req.body;
      //console.log("id", clienteId);

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
        console.log("currentDateTime", currentDateTime);
        console.log("horaEstimada", horaEstimada);

        //console.log("Medico encontrado = ", medicoEncontrado);

        // Actualizar la consulta con el médico y la fecha y hora
        await consultaDePaciente.update({
          estado: ENUM_CONSULTA_ESTADOS.solicitandoMedico,
          medicoId: medicoEncontrado.id,
          fechaSeleccion: horaEstimada,
          tiempoLlegada,
        });

        res.status(200).json({
          message: "Agregado médico a consulta con éxito",
          estado: ENUM_CONSULTA_ESTADOS.solicitandoMedico,
          hora: horaEstimada,
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
        include: {
          model: cliente,
          include: {
            attributes: ["valoracion", "resenas"],
            model: usuario,
          },
        },
        where: {
          medicoId,
          estado: ENUM_CONSULTA_ESTADOS.solicitandoMedico,
        },
      });

      if (consultaDeMedico) {
        const usuarioDeLaConsulta = await persona.findOne({
          where: {
            id: consultaDeMedico.personaId,
          },
        });

        console.log(
          "consultaDeMedico.fechaSeleccion",
          consultaDeMedico.fechaSeleccion
        );

        const resultFinal = {};
        resultFinal.motivo = consultaDeMedico.motivo;
        resultFinal.sintomas = consultaDeMedico.sintomas;
        resultFinal.precio = consultaDeMedico.precio;
        resultFinal.tiempoLlegada = consultaDeMedico.tiempoLlegada;
        resultFinal.estado = consultaDeMedico.estado;
        resultFinal.especialidad = consultaDeMedico.especialidad;
        resultFinal.valoracionMedico = consultaDeMedico.valoracionMedico;
        resultFinal.valoracionCliente = consultaDeMedico.valoracionCliente;
        resultFinal.comentarioDelCliente =
          consultaDeMedico.comentarioDelCliente;
        resultFinal.comentarioDelMedico = consultaDeMedico.comentarioDelMedico;
        resultFinal.direccion = consultaDeMedico.direccion;
        resultFinal.piso = consultaDeMedico.piso;
        resultFinal.departamento = consultaDeMedico.departamento;
        resultFinal.observacion = consultaDeMedico.observacion;
        resultFinal.createdAt = consultaDeMedico.createdAt;
        resultFinal.updateAt = consultaDeMedico.updateAt;
        resultFinal.latitudCliente = consultaDeMedico.latitudCliente;
        resultFinal.longitudCliente = consultaDeMedico.longitudCliente;
        resultFinal.fechaSeleccion = consultaDeMedico.fechaSeleccion;
        resultFinal.nombre = usuarioDeLaConsulta.nombre;
        resultFinal.apellido = usuarioDeLaConsulta.apellido;
        resultFinal.sexo = usuarioDeLaConsulta.sexo;
        resultFinal.fechaNacimiento = usuarioDeLaConsulta.fechaNacimiento;
        resultFinal.valoracion = consultaDeMedico.cliente.usuario.valoracion;
        resultFinal.resenas = consultaDeMedico.cliente.usuario.resenas;

        res.status(200).json({
          success: true,
          message: "Consulta",
          result: resultFinal,
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Consulta",
          result: null,
        });
      }
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

      const medicoEncontrado = await medico.findOne({
        where: {
          id: medicoId,
        },
      });

      if (consultaDeMedico && usuarioEncontrado && medicoEncontrado) {
        await consultaDeMedico.update({
          estado: ENUM_CONSULTA_ESTADOS.enCurso,
          precio: medicoEncontrado.precio,
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

      if (consultaDeMedico) {
        await consultaDeMedico.update({
          estado: ENUM_CONSULTA_ESTADOS.rechazada,
        });

        if (usuarioEncontrado) {
          await usuarioEncontrado.update({
            estado: ENUM_USUARIO_ESTADOS.desconectado,
          });
        }

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
          clienteId,
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

  removerConsultaCliente = async (req, res, next) => {
    try {
      const { id: clienteId } = req.cliente; // Obtenemos el ID del médico desde el token

      const consultaEnCurso = await consulta.findOne({
        where: {
          clienteId,
          estado: ENUM_CONSULTA_ESTADOS.solicitandoMedico,
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

  cancelarConsultaClienteSinEmpezar = async (req, res, next) => {
    try {
      const { id: clienteId } = req.cliente; // Obtenemos el ID del médico desde el token

      const consultaEnCurso = await consulta.findOne({
        where: {
          clienteId,
          estado: ENUM_CONSULTA_ESTADOS.seleccionandoMedico,
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
        await this.calcularValoracionPromedioMedico(consultaDeCliente.medicoId);
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

      console.log("1", { valoracion, comentario });
      const consultasMedico = await consulta.findAll({
        where: {
          medicoId,
          estado: ENUM_CONSULTA_ESTADOS.calificando,
        },
      });
      const consultaDeMedico = consultasMedico[0];
      console.log("2", consultaDeMedico);

      if (consultaDeMedico) {
        if (consultaDeMedico.valoracionCliente) {
          console.log("3", consultaDeMedico.valoracionCliente);
          await consultaDeMedico.update({
            valoracionMedico: valoracion,
            comentarioDelMedico: comentario,
            estado: ENUM_CONSULTA_ESTADOS.finalizada,
          });
        } else {
          console.log("4", consultaDeMedico.valoracionCliente);
          await consultaDeMedico.update({
            valoracionMedico: valoracion,
            comentarioDelMedico: comentario,
          });
        }
        await this.calcularValoracionPromedioCliente(
          consultaDeMedico.clienteId
        );

        console.log("5", consultaDeMedico);
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

  calcularValoracionPromedioCliente = async (clienteId) => {
    try {
      let clienteConsulta;
      let usuarioCliente;
      const consultasTotales = await consulta.findAll({
        attributes: ["valoracionMedico"],
        where: {
          clienteId,
          [Op.or]: [
            {
              estado: ENUM_CONSULTA_ESTADOS.finalizada,
            },
            {
              estado: ENUM_CONSULTA_ESTADOS.calificando,
            },
          ],
        },
      });
      let valFinal;
      let valTotal = 0;
      let valoracion;
      let cantidadConsultasConValoracion = consultasTotales.length;
      for (let i = 0; i < consultasTotales.length; i++) {
        valoracion = consultasTotales[i].valoracionMedico;

        if (valoracion) {
          valTotal += valoracion;
        } else {
          cantidadConsultasConValoracion -= 1;
        }
      }

      clienteConsulta = await cliente.findOne({
        attributes: ["usuarioId"],
        where: {
          id: clienteId,
        },
      });
      usuarioCliente = await usuario.findOne({
        where: {
          id: clienteConsulta.usuarioId,
        },
      });

      if (!valTotal || !cantidadConsultasConValoracion) {
        valFinal = 0;
      } else {
        valFinal = parseInt(valTotal / cantidadConsultasConValoracion);
      }

      await usuarioCliente.update({
        valoracion: valFinal,
        resenas: cantidadConsultasConValoracion,
      });
    } catch (error) {
      console.log("No se pudo realizar el update a la valoracion del usuario.");
      console.log(error.message);
    }
  };

  calcularValoracionPromedioMedico = async (medicoId) => {
    try {
      let medicoConsulta;
      let usuarioMedico;

      const consultasTotales = await consulta.findAll({
        attributes: ["valoracionCliente"],
        where: {
          medicoId,
          [Op.or]: [
            {
              estado: ENUM_CONSULTA_ESTADOS.finalizada,
            },
            {
              estado: ENUM_CONSULTA_ESTADOS.calificando,
            },
          ],
        },
      });
      let valFinal;
      let valTotal = 0;
      let valoracion;
      let cantidadConsultasConValoracion = consultasTotales.length;
      for (let i = 0; i < consultasTotales.length; i++) {
        valoracion = consultasTotales[i].valoracionCliente;
        if (valoracion) {
          valTotal += valoracion;
        } else {
          cantidadConsultasConValoracion -= 1;
        }
      }

      medicoConsulta = await medico.findOne({
        attributes: ["usuarioId"],
        where: {
          id: medicoId,
        },
      });
      usuarioMedico = await usuario.findOne({
        where: {
          id: medicoConsulta.usuarioId,
        },
      });

      if (!valTotal || !cantidadConsultasConValoracion) {
        valFinal = 0;
      } else {
        valFinal = parseInt(valTotal / cantidadConsultasConValoracion);
      }
      await usuarioMedico.update({
        valoracion: valFinal,
        resenas: cantidadConsultasConValoracion,
      });
    } catch (error) {
      console.log("No se pudo realizar el update a la valoracion del usuario.");
      console.log(error.message);
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

      await consultaDeMedico.update({
        observacion,
      });

      res.status(200).send({
        success: true,
        message: "Observacion actualizada",
        result: observacion,
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
