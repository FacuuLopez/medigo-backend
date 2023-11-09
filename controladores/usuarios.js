import {
  medico,
  cliente,
  usuario,
  persona,
  grupoFamiliar,
} from "../modelos/index.js";
import { crearTokenUsuario, enviarTokenUsuario } from "../utils/jwt.js";

class usuariosController {
  constructor() {}

  createUsuario = async (req, res, next) => {
    try {
      const {
        username,
        password,
        dni,
        telefono,
        direccion,
        valoracion,
        estado,
        personaId,
      } = req.body;
      const result = await usuario.create({
        username,
        password,
        dni,
        telefono,
        direccion,
        valoracion,
        estado,
        personaId,
      });
      if (!result) {
        const error = new Error("No se pudo crear al usuario");
        error.status = 400;
        throw error;
      }
      res.status(200).send({
        success: true,
        message: "Usuario creado con exito",
        result,
      });
    } catch (error) {
      res.status(200).send({
        success: false,
        message: error.message,
      });
    }
  };

  getUsuarioPorId = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await usuario.findAll({
        attributes: [
          "id",
          "username",
          "password",
          "dni",
          "telefono",
          "direccion",
          "valoracion",
          "estado",
        ],
        where: {
          id,
        },
      });
      if (result.length === 0) throw new Error("No hay usuario");
      // console.log("result:", result[0].dataValues);
      res.status(200).send({
        success: true,
        message: "Usuario encontrado",
        result: result[0].dataValues,
      });
    } catch (error) {
      res.status(200).send({
        success: false,
        message: error.message,
      });
    }
  };

  updateUsuarioPorId = async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        username,
        password,
        dni,
        telefono,
        direccion,
        valoracion,
        estado,
      } = req.body;
      const result = await usuario.update(
        { username, password, dni, telefono, direccion, valoracion, estado },
        {
          where: {
            id,
          },
        }
      );
      console.log("Result:", result);
      if (result[0] === 0) throw new Error("No se pudo modificar el usuario");
      // if(!result) throw new Error ("No se pudo crear el producto")
      res.status(200).send({
        success: true,
        message: "Usuario modificado exitosamente",
      });
    } catch (error) {
      res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  };

  deleteUsuarioPorId = async (req, res, next) => {
    try {
      const { id } = req.params;
      await usuario.destroy({
        where: {
          id,
        },
      });

      // Enviar una respuesta exitosa
      res.status(200).json({ message: "Usuario eliminado exitosamente" });
    } catch (error) {
      // Manejar cualquier error que ocurra durante el proceso
      res.status(500).json({ error: "Error al eliminar el usuario" });
    }
  };

  login = async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const result = await usuario.findOne({
        where: {
          username,
        },
      });
      if (!result) throw new Error("Credenciales incorrectas");
      const compare = await result.validatePassword(
        password,
        result.dataValues.password
      );
      if (!compare) throw new Error("Credenciales incorrectas");
      const tokenUsuario = crearTokenUsuario({ username });
      enviarTokenUsuario(tokenUsuario, res);
      const { id } = result;
      const medicoEncontrado = await medico.findOne({
        where: {
          usuarioId: id,
        },
        include: [
          {
            model: usuario,
            include: [
              {
                model: persona,
              },
            ],
          },
        ],
      });
      if (medicoEncontrado) {
        const { nroMatricula, radioAccion, precio, especialidad, usuario } =
          medicoEncontrado.dataValues;
        const { username, dni, telefono, direccion, estado, persona } =
          usuario.dataValues;
        const { nombre, apellido, sexo, fechaNacimiento } = persona.dataValues;
        res.status(200).json({
          nroMatricula,
          radioAccion,
          precio,
          especialidad,
          nombre,
          apellido,
          sexo,
          fechaNacimiento,
          username,
          dni,
          telefono,
          direccion,
          estado,
        });
      } else {
        const clienteEncontrado = await cliente.findOne({
          where: {
            usuarioId: id,
          },
          include: [
            {
              model: usuario,
              include: [
                {
                  model: persona,
                },
              ],
            },
            {
              model: grupoFamiliar,
              include: [
                {
                  model: persona,
                },
              ],
            },
          ],
        });
        if (clienteEncontrado) {
          const { grupoFamiliar: familiares, usuario } =
            clienteEncontrado.dataValues;
          const grupoFamiliarConId = familiares.personas;
          // le saco el id del grupo familiar para la respuesta
          const grupoFamiliar = grupoFamiliarConId.map((familiar) => {
            const { grupoFamiliarId, ...resto } = familiar.dataValues;
            return resto;
          });

          const { username, dni, telefono, direccion, estado, persona } =
            usuario.dataValues;
          const { nombre, apellido, sexo, fechaNacimiento } =
            persona.dataValues;
          const { codigoPostal, ciudad } = clienteEncontrado.dataValues;
          res.status(200).json({
            nombre,
            apellido,
            sexo,
            fechaNacimiento,
            username,
            password,
            dni,
            telefono,
            direccion,
            codigoPostal,
            ciudad,
            estado,
            grupoFamiliar,
          });
        } else throw error;
      }
    } catch (error) {
      console.error(error);
      res
        .status(401)
        .send({ success: false, result: "Credenciales incorrectas" });
    }
  };

  logout = async (req, res, next) => {};
}

export default usuariosController;
