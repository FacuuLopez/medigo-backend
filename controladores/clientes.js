import { cliente, grupoFamiliar, usuario, persona } from "../modelos/index.js";
import bcrypt from 'bcrypt';

export const crearNuevoCliente = async ({
    nombre, apellido, sexo, fechaNacimiento,
    username, password, dni, telefono, direccion, estado,
    grupoFamiliar: familiares
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
        for (const familiar of familiares) await persona.create({...familiar,  grupoFamiliarId: nuevoGrupoFamiliar.dataValues.id});
    }
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
    //crear nuevo cliente
    const nuevoCliente = await cliente.create({
        usuarioId: nuevoUsuario.dataValues.id,
        grupoFamiliarId: nuevoGrupoFamiliar.dataValues.id,
    });

    return
}

class clientesController {
    constructor() { }

    createCliente = async (req, res, next) => {
        try {

            const { nombre, apellido, sexo, fechaNacimiento,
                username, password, dni, telefono, direccion,
                grupoFamiliar 
            } = req.body;
            const estado = 'desconectado';
            await crearNuevoCliente({ nombre, apellido, sexo, fechaNacimiento,
                username, password, dni, telefono, direccion, estado,
                grupoFamiliar});

            res.status(200).send({
                success: true,
                message: "Cliente creado con exito",
            });
        } catch (error) {
            res.status(500).send({
                success: false,
                message: error.message,
            });
        }
    }

    getClientePorId = async (req, res, next) => {
        try {
            const { id } = req.params;
            const result = await cliente.findAll({
                attributes: ["id", "usuarioId", "grupoFamiliarId"],
                where: {
                    id
                }
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
    }

    updateClientePorId = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { usuarioId, grupoFamiliarId } = req.body;
            const result = await cliente.update(
                { usuarioId, grupoFamiliarId },
                {
                    where: {
                        id,
                    },
                }
            );
            console.log("Result:", result);
            if (result[0] === 0) throw new Error("No se pudo modificar el cliente");
            // if(!result) throw new Error ("No se pudo crear el producto")
            res.status(200).send({
                success: true,
                message: "Cliente modificado exitosamente",
            });
        } catch (error) {
            res.status(400).send({
                success: false,
                message: error.message,
            });
        }
    }

    deleteClientePorId = async (req, res, next) => {
        try {
            const { id } = req.params;
            await cliente.destroy({
                where: {
                    id
                }
            });

            // Enviar una respuesta exitosa
            res.status(200).json({ message: 'Cliente eliminado exitosamente' });
        } catch (error) {
            // Manejar cualquier error que ocurra durante el proceso
            res.status(500).json({ error: 'Error al eliminar el cliente' });
        }
    }


    registro = async (req, res, next) => {

    }

    actualizarDatosCliente = async (req, res, next) => {

    }
}

export default clientesController;