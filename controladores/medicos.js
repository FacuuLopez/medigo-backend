import { medico, persona, usuario } from "../modelos/index.js";
import bcrypt from "bcrypt";
import { ENUM_USUARIO_ESTADOS } from "../utils/enums.js";

export const crearMedico = async ({
  nroMatricula,
  radioAccion,
  precio,
  especialidad,
  nombre,
  apellido,
  sexo,
  fechaNacimiento,
  username,
  password,
  dni,
  telefono,
  direccion,
  estado,
}) => {
  const nuevaPersona = await persona.create({
    nombre,
    apellido,
    sexo,
    fechaNacimiento,
  });

  //crea el usuario
  const nuevoUsuario = await usuario.create({
    username,
    password,
    dni,
    telefono,
    direccion,
    estado,
    personaId: nuevaPersona.dataValues.id, // Asociar el Usuario a la Persona recién creada
  });

  const nuevoMedico = await medico.create({
    usuarioId: nuevoUsuario.dataValues.id,
    nroMatricula,
    precio,
    radioAccion,
    especialidad,
  });

  return nuevoMedico;
};

class medicosController {
  constructor() {}

  createMedico = async (req, res, next) => {
    try {
      const {
        nroMatricula,
        radioAccion,
        precio,
        especialidad,
        nombre,
        apellido,
        sexo,
        fechaNacimiento,
        username,
        password,
        dni,
        telefono,
        direccion,
      } = req.body;
      const estado = ENUM_USUARIO_ESTADOS.desconectado;
      await crearMedico({
        nroMatricula,
        radioAccion,
        precio,
        especialidad,
        nombre,
        apellido,
        sexo,
        fechaNacimiento,
        username,
        password,
        dni,
        telefono,
        direccion,
        estado,
      });

      res.status(200).send({
        success: true,
        message: "Medico creado con exito",
      });
    } catch (error) {
      res.status(200).send({
        success: false,
        message: error.message,
      });
    }
  };

  getMedicoPorId = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await medico.findAll({
        attributes: [
          "id",
          "nroMatricula",
          "radioAccion",
          "precio",
          "usuarioId",
        ],
        where: {
          id,
        },
      });
      if (result.length === 0) throw new Error("No hay usuario");
      // console.log("result:", result[0].dataValues);
      res.status(200).send({
        success: true,
        message: "Medico encontrado",
        result: result[0].dataValues,
      });
    } catch (error) {
      res.status(200).send({
        success: false,
        message: error.message,
      });
    }
  };

  updateMedicoPorId = async (req, res, next) => {
    try {
      const { id, usuarioId } = req.medico;
      const {
        nroMatricula,
        radioAccion,
        precio,
        especialidad,
        sexo,
        direccion,
        telefono,
        fechaNacimiento,
        username,
        password,
      } = req.body;

      const datosMedico = {};
      const datosUsuario = {};
      const datosPersona = {};

      if (nroMatricula !== undefined && nroMatricula !== null) {
        datosMedico.nroMatricula = nroMatricula;
      }

      if (radioAccion !== undefined && radioAccion !== null) {
        datosMedico.radioAccion = radioAccion;
      }

      if (precio !== undefined && precio !== null) {
        datosMedico.precio = precio;
      }

      if (especialidad !== undefined && especialidad !== null) {
        datosMedico.especialidad = especialidad;
      }

      if (sexo !== undefined && sexo !== null) {
        datosPersona.sexo = sexo;
      }

      if (direccion !== undefined && direccion !== null) {
        datosUsuario.direccion = direccion;
      }

      if (telefono !== undefined && telefono !== null) {
        datosUsuario.telefono = telefono;
      }

      if (fechaNacimiento !== undefined && fechaNacimiento !== null) {
        datosPersona.fechaNacimiento = fechaNacimiento;
      }

      if (username !== undefined && username !== null) {
        datosUsuario.username = username;
      }

      if (password !== undefined && password !== null) {
        datosUsuario.password = password;
      }

      const medicoEncontrado = await medico.findByPk(id, {
        include: [
          {
            model: usuario,
            include: [persona], // Si también quieres incluir el modelo Persona dentro del modelo Usuario
          },
        ],
      });

      const { personaId } = medicoEncontrado.usuario.dataValues;

      const resultUsuario = await usuario.update(
        {
          ...datosUsuario,
        },
        {
          where: { id: usuarioId },
        }
      );
      const resultPersona = await persona.update(
        {
          ...datosPersona,
        },
        {
          where: { id: personaId },
        }
      );
      console.log(resultUsuario.dataValues);
      const resultMedico = await medico.update(
        {
          ...datosMedico,
        },
        {
          where: {},
        }
      );
      if (
        resultMedico[0] === 0 &&
        resultUsuario[0] === 0 &&
        resultPersona[0] === 0
      )
        throw new Error("No se pudo modificar el medico");
      // if(!result) throw new Error ("No se pudieron actualizar los datos")
      res.status(200).send({
        success: true,
        message: "Medico modificado exitosamente",
      });
    } catch (error) {
      console.error(error);
      res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  };

  actualizarEstadoMedico = async (req, res, next) => {
    try {
      const { usuarioId } = req.medico;
      let estadoNuevo = "";

      const usuarioEncontrado = await usuario.findOne({
        where: {
          id: usuarioId,
        },
      });

      if (usuarioEncontrado) {
        if (usuarioEncontrado.estado === ENUM_USUARIO_ESTADOS.conectado) {
          estadoNuevo = ENUM_USUARIO_ESTADOS.desconectado;
        } else {
          estadoNuevo = ENUM_USUARIO_ESTADOS.conectado;
        }

        await usuarioEncontrado.update({
          estado: estadoNuevo,
        });

        res.status(200).json({
          message: "Estado del médico actualizado con éxito",
          state: estadoNuevo,
        });
      } else {
        res.status(404).json({
          message: "No se encontró el usuario asociado al médico",
        });
      }
    } catch (error) {
      // Manejar cualquier error que ocurra durante el proceso
      console.error(error);
      res.status(500).json({ error: "Error al actualizar estado del médico" });
    }
  };

  deleteMedicoPorId = async (req, res, next) => {
    try {
      const { id } = req.params;
      await medico.destroy({
        where: {
          id,
        },
      });

      // Enviar una respuesta exitosa
      res.status(200).json({ message: "Medico eliminado exitosamente" });
    } catch (error) {
      // Manejar cualquier error que ocurra durante el proceso
      res.status(500).json({ error: "Error al eliminar el medico" });
    }
  };

  registro = async (req, res, next) => {};

  actualizarDatosMedico = async (req, res, next) => {};

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

export default medicosController;
