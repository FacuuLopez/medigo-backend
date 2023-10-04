import { usuario } from "../modelos/index.js";

class usuariosController {
    constructor() {}

    createUsuario = async (req, res, next) =>{
        try{

            const { username, password, dni, telefono, direccion, valoracion, estado, personaId } = req.body;
            const result = await usuario.create({ username, password, dni,  telefono, direccion, valoracion, estado, personaId  });
            if(!result){
                const error = new Error("No se pudo crear al usuario");
                error.status = 400;
                throw error;
            } 
            res.status(200).send({
                success: true, 
                message:"Usuario creado con exito",
                result,
            });
        
        } catch(error) {
            res.status(200).send({
                success: false,
                message: error.message,
            });
        }
    }

    getUsuarioPorId = async (req, res, next) =>{
        try {
            const {id} = req.params;
            const result = await usuario.findAll({
                attributes: ["id", "username", "password" , "dni", "telefono", 
                "direccion", "valoracion", "estado"],
                where: {
                    id
                }
            });
            if(result.length===0) throw new Error("No hay usuario");
            // console.log("result:", result[0].dataValues);
            res.status(200).send({
                success: true,
                message: "Usuario encontrado",
                result: result[0].dataValues,
            });
        } catch(error) {
            res.status(200).send({
                success: false,
                message: error.message,
            });
        }
    }

    updateUsuarioPorId = async (req, res, next) =>{
        try {
            const { id } = req.params;
            const { username, password, dni, telefono, direccion, valoracion, estado } = req.body;
            const result = await usuario.update(
                { username, password, dni, telefono, direccion, valoracion, estado },
                {
                    where: {
                        id,
                    },
                }
            );
            console.log("Result:", result);
            if(result[0]===0) throw new Error("No se pudo modificar el usuario");
            // if(!result) throw new Error ("No se pudo crear el producto")
            res.status(200).send({
                success: true,
                message: "Usuario modificado exitosamente",
            });
        } catch(error) {
            res.status(400).send({
                success: false,
                message: error.message,
            });
        }
        
    }

    deleteUsuarioPorId = async (req, res, next) =>{
        try {
            const {id}= req.params;
            await usuario.destroy({where:{
              id
            }});
        
            // Enviar una respuesta exitosa
            res.status(200).json({ message: 'Usuario eliminado exitosamente' });
          } catch (error) {
            // Manejar cualquier error que ocurra durante el proceso
            res.status(500).json({ error: 'Error al eliminar el usuario' });
          }
    }

    login = async (req, res, next) => {
        
    }

    logout = async (req, res, next) => {
        
    }
}

export default usuariosController;