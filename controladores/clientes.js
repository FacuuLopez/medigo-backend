import { cliente, grupoFamiliar, usuario, persona } from "../modelos/index.js";
import bcrypt from "bcrypt";
import { ENUM_USUARIO_ESTADOS } from "../utils/enums.js";

export const crearNuevoCliente = async ({
  nombre,
  apellido,
  sexo,
  fechaNacimiento,
  username,
  password,
  dni,
  telefono,
  direccion,
  piso,
  departamento,
  estado,
  grupoFamiliar: familiares,
  ciudad,
  codigoPostal,
}) => {
  // Primero, crea un Grupo Familiar
  const nuevoGrupoFamiliar = await grupoFamiliar.create({
    // Propiedades del Grupo Familiar
  });
  console.log(nuevoGrupoFamiliar.dataValues);
  // A continuación, crea una Persona asociada al Grupo Familiar
  const nuevaPersona = await persona.create({
    nombre,
    apellido,
    sexo,
    fechaNacimiento,
    grupoFamiliarId: nuevoGrupoFamiliar.dataValues.id, // Asociar la persona al Grupo Familiar recién creado
  });
  //agrega los familiares
  if (familiares.length > 0) {
    for (const familiar of familiares)
      await persona.create({
        ...familiar,
        grupoFamiliarId: nuevoGrupoFamiliar.dataValues.id,
      });
  }
  //crea el usuario
  const nuevoUsuario = await usuario.create({
    username,
    password,
    dni,
    telefono,
    direccion,
    piso,
    departamento,
    valoracion: 0,
    resenas: 0,
    estado,
    personaId: nuevaPersona.dataValues.id, // Asociar el Usuario a la Persona recién creada
  });
  //crear nuevo cliente
  const nuevoCliente = await cliente.create({
    usuarioId: nuevoUsuario.dataValues.id,
    grupoFamiliarId: nuevoGrupoFamiliar.dataValues.id,
    codigoPostal: codigoPostal,
    ciudad: ciudad,
  });

  return;
};

class clientesController {
  constructor() {}

  createCliente = async (req, res, next) => {
    try {
      const {
        nombre,
        apellido,
        sexo,
        fechaNacimiento,
        username,
        password,
        dni,
        telefono,
        direccion,
        piso,
        departamento,
        grupoFamiliar,
        codigoPostal,
        ciudad,
      } = req.body;

      const usernameInUse = await usuario.findOne({
        where: {
          username,
        },
      });

      if (usernameInUse) {
        res.status(200).send({
          success: false,
          message: "username en uso",
        });
      } else {
        const estado = ENUM_USUARIO_ESTADOS.desconectado;
        await crearNuevoCliente({
          nombre,
          apellido,
          sexo,
          fechaNacimiento,
          username,
          password,
          dni,
          telefono,
          direccion,
          piso,
          departamento,
          estado,
          grupoFamiliar,
          codigoPostal,
          ciudad,
        });

        res.status(200).send({
          success: true,
          message: "Cliente creado con exito",
        });
      }
    } catch (error) {
      res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  };

  getClientePorId = async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await cliente.findAll({
        attributes: ["id", "usuarioId", "grupoFamiliarId"],
        where: {
          id,
        },
      });
      if (result.length === 0) throw new Error("No hay cliente");
      // console.log("result:", result[0].dataValues);
      res.status(200).send({
        success: true,
        message: "Cliente encontrado",
        result: result[0].dataValues,
      });
    } catch (error) {
      res.status(200).send({
        success: false,
        message: error.message,
      });
    }
  };

  updateClientePorId = async (req, res, next) => {
    try {
      const { id, usuarioId, grupoFamiliarId } = req.cliente;
      const {
        grupoFamiliar: familiares,
        username,
        password,
        telefono,
        fechaNacimiento,
        direccion,
        piso,
        departamento,
        sexo,
        codigoPostal,
        ciudad,
      } = req.body;
      const clienteEncontradoRecien = await cliente.findByPk(id, {
        include: [
          {
            model: usuario,
            include: [persona],
          },
        ],
      });

      const datosUsuario = {};

      if (username !== undefined && username !== null) {
        datosUsuario.username = username;
      }

      if (password !== undefined && password !== null) {
        datosUsuario.password = password;
      }

      if (direccion !== undefined && direccion !== null) {
        datosUsuario.direccion = direccion;
      }

      if (piso !== undefined && piso !== null) {
        datosUsuario.piso = piso;
      }

      if (departamento !== undefined && departamento !== null) {
        datosUsuario.departamento = departamento;
      }

      if (telefono !== undefined && telefono !== null) {
        datosUsuario.telefono = telefono;
      }

      const datosPersona = {};

      if (sexo !== undefined && sexo !== null) {
        datosPersona.sexo = sexo;
      }

      if (fechaNacimiento !== undefined && fechaNacimiento !== null) {
        datosPersona.fechaNacimiento = fechaNacimiento;
      }

      const datosCliente = {};

      if (familiares !== undefined && familiares !== null) {
        datosCliente.familiares = familiares;
      }

      const datosPersonalesCliente = {};
      if (ciudad !== undefined && ciudad !== null) {
        datosPersonalesCliente.ciudad = ciudad;
      }

      if (codigoPostal !== undefined && codigoPostal !== null) {
        datosPersonalesCliente.codigoPostal = codigoPostal;
      }

      const clienteEncontrado = await cliente.findByPk(id, {
        include: [
          {
            model: usuario,
            include: [persona], // Si también quieres incluir el modelo Persona dentro del modelo Usuario
          },
        ],
      });

      const { personaId } = clienteEncontrado.usuario.dataValues;

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
      const resultCliente = await cliente.update(
        {
          ...datosPersonalesCliente,
        },
        {
          where: { id },
        }
      );
      if (familiares && familiares.length > 0) {
        for (const familiar of familiares) {
          const { id, nombre, apellido, sexo, fechaNacimiento } = familiar;

          const familiarEncontrado = await persona.findByPk(id);
          console.log("familiarEncontrado", familiarEncontrado.dataValues);
          if (grupoFamiliarId !== familiarEncontrado.dataValues.grupoFamiliarId)
            throw new Error("no tiene los permisos necesarios");
          const datosFamiliar = {};

          if (nombre !== undefined && nombre !== null) {
            datosFamiliar.nombre = nombre;
          }

          if (apellido !== undefined && apellido !== null) {
            datosFamiliar.apellido = apellido;
          }

          if (sexo !== undefined && sexo !== null) {
            datosFamiliar.sexo = sexo;
          }

          if (fechaNacimiento !== undefined && fechaNacimiento !== null) {
            datosFamiliar.fechaNacimiento = fechaNacimiento;
          }

          await persona.update(
            {
              ...datosFamiliar,
            },
            {
              where: {
                id,
              },
            }
          );
        }
      }

      res.status(200).send({
        success: true,
        message: "Cliente modificado exitosamente",
      });
    } catch (error) {
      console.error(error);
      res.status(400).send({
        success: false,
        message: error.message,
      });
    }
  };

  deleteClientePorId = async (req, res, next) => {
    try {
      const { id } = req.params;
      await cliente.destroy({
        where: {
          id,
        },
      });

      // Enviar una respuesta exitosa
      res.status(200).json({ message: "Cliente eliminado exitosamente" });
    } catch (error) {
      // Manejar cualquier error que ocurra durante el proceso
      res.status(500).json({ error: "Error al eliminar el cliente" });
    }
  };

  registro = async (req, res, next) => {};

  actualizarDatosCliente = async (req, res, next) => {};

  eliminarMiembroFamiliar = async (req, res, next) => {
    try {
      const { id: clienteId } = req.cliente;
      const { nombre, apellido, fechaNacimiento } = req.body;

      console.log("cliente: ", clienteId);
      console.log("clienteData: ", { nombre, apellido, fechaNacimiento });

      const clienteEncontrado = await cliente.findOne({
        where: { id: clienteId },
        include: [
          grupoFamiliar,
          {
            model: usuario,
            include: [persona],
          },
        ],
      });

      if (!clienteEncontrado) {
        return res.status(404).json({ message: "No se encontró el cliente" });
      }

      const grupoFamiliarId = clienteEncontrado.grupoFamiliar.id;
      const personaId = clienteEncontrado.usuario.persona.id;

      const miembroFamiliar = await persona.findOne({
        where: {
          nombre,
          apellido,
          fechaNacimiento,
          grupoFamiliarId,
        },
      });

      if (!miembroFamiliar) {
        return res
          .status(404)
          .json({ message: "No se encontró el miembro de la familia" });
      }

      if (miembroFamiliar.id === personaId) {
        return res
          .status(400)
          .json({ message: "No puedes eliminar al titular de la cuenta" });
      }

      await persona.destroy({ where: { id: miembroFamiliar.id } });

      res.status(200).json({
        message: "Miembro del grupo familiar eliminado exitosamente",
        success: true,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "Error al eliminar el miembro del grupo familiar",
        error: error.message,
      });
    }
  };

  agregarMiembroFamiliar = async (req, res, next) => {
    try {
      const { id: clienteId } = req.cliente;
      const { nombre, apellido, sexo, fechaNacimiento } = req.body;

      const clienteEncontrado = await cliente.findOne({
        where: { id: clienteId },
        include: [
          grupoFamiliar,
          {
            model: usuario,
            include: [persona],
          },
        ],
      });

      if (!clienteEncontrado) {
        return res.status(404).json({ message: "No se encontró el cliente" });
      }

      const grupoFamiliarId = clienteEncontrado.grupoFamiliar.id;

      const nuevoMiembroFamiliar = await persona.create({
        nombre,
        apellido,
        sexo,
        fechaNacimiento,
        grupoFamiliarId,
      });

      res.status(200).json({
        message: "Miembro del grupo familiar agregado exitosamente",
        miembroFamiliar: nuevoMiembroFamiliar,
        success: true,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "Error al agregar el miembro del grupo familiar",
        message: error.message,
      });
    }
  };

  modificarMiembroFamiliar = async (req, res, next) => {
    try {
      const { id: clienteId } = req.cliente;
      const {
        nombreViejo,
        apellidoViejo,
        nombreNuevo,
        apellidoNuevo,
        sexoNuevo,
        fechaNacimientoNuevo,
        fechaNacimientoViejo,
      } = req.body;

      const clienteEncontrado = await cliente.findOne({
        where: { id: clienteId },
        include: [
          grupoFamiliar,
          {
            model: usuario,
            include: [persona],
          },
        ],
      });

      if (!clienteEncontrado) {
        return res.status(404).json({ message: "No se encontró el cliente" });
      }

      const grupoFamiliarId = clienteEncontrado.grupoFamiliar.id;

      const miembroFamiliar = await persona.findOne({
        where: {
          nombre: nombreViejo,
          apellido: apellidoViejo,
          fechaNacimiento: fechaNacimientoViejo,
          grupoFamiliarId,
        },
      });

      if (!miembroFamiliar) {
        return res
          .status(404)
          .json({ message: "No se encontró el miembro de la familia" });
      }

      await persona.update(
        {
          nombre: nombreNuevo !== undefined ? nombreNuevo : nombreViejo,
          apellido: apellidoNuevo !== undefined ? apellidoNuevo : apellidoViejo,
          sexo: sexoNuevo !== undefined ? sexoNuevo : miembroFamiliar.sexo,
          fechaNacimiento:
            fechaNacimientoNuevo !== undefined
              ? fechaNacimientoNuevo
              : fechaNacimientoViejo,
        },
        {
          where: { id: miembroFamiliar.id },
        }
      );

      res.status(200).json({
        message: "Miembro del grupo familiar modificado exitosamente",
        success: true,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "Error al modificar el miembro del grupo familiar",
        message: error.message,
      });
    }
  };
}

export default clientesController;
