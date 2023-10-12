import { medico, persona, usuario } from "../modelos/index.js";
import bcrypt from 'bcrypt';

export const crearMedico = async ({
    nroMatricula, radioAccion, precio, especialidad,
    nombre, apellido, sexo, fechaNacimiento,
    username, password, dni, telefono, direccion, estado,
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
        especialidad
    });

    return nuevoMedico
}

class medicosController {
    constructor() { }

    createMedico = async (req, res, next) => {
        try {

            const {
                nroMatricula, radioAccion, precio, especialidad,
                nombre, apellido, sexo, fechaNacimiento,
                username, password, dni, telefono, direccion, estado,
            } = req.body;

            await crearMedico({
                nroMatricula, radioAccion, precio, especialidad,
                nombre, apellido, sexo, fechaNacimiento,
                username, password, dni, telefono, direccion, estado,
            })
            
            res.status(200).send({
                success: true,
                message: "Medico creado con exito",
                result,
            });

        } catch (error) {
            res.status(200).send({
                success: false,
                message: error.message,
            });
        }
    }

    getMedicoPorId = async (req, res, next) => {
        try {
            const { id } = req.params;
            const result = await medico.findAll({
                attributes: ["id", "nroMatricula", "radioAccion", "precio", "usuarioId"],
                where: {
                    id
                }
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
    }

    updateMedicoPorId = async (req, res, next) => {
        try {
            const { id } = req.params;
            const { nroMatricula, radioAccion, precio } = req.body;
            const result = await medico.update(
                { nroMatricula, radioAccion, precio },
                {
                    where: {
                        id,
                    },
                }
            );
            console.log("Result:", result);
            if (result[0] === 0) throw new Error("No se pudo modificar el medico");
            // if(!result) throw new Error ("No se pudo crear el producto")
            res.status(200).send({
                success: true,
                message: "Medico modificado exitosamente",
            });
        } catch (error) {
            res.status(400).send({
                success: false,
                message: error.message,
            });
        }
    }

    deleteMedicoPorId = async (req, res, next) => {
        try {
            const { id } = req.params;
            await medico.destroy({
                where: {
                    id
                }
            });

            // Enviar una respuesta exitosa
            res.status(200).json({ message: 'Medico eliminado exitosamente' });
        } catch (error) {
            // Manejar cualquier error que ocurra durante el proceso
            res.status(500).json({ error: 'Error al eliminar el medico' });
        }
    }

    registro = async (req, res, next) => {

    }

    actualizarDatosMedico = async (req, res, next) => {

    }

}

export default medicosController;