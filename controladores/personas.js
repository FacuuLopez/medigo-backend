import { persona } from "../modelos/index.js";

class personaController {
    constructor() {}

    createPersona= async (req, res, next) =>{
        try{

            const { nombre, apellido, sexo, fechaNacimiento } = req.body;
            const result = await persona.create({ nombre, apellido, sexo, fechaNacimiento});
            if(!result){
                const error = new Error("No se pudo crear a la persona");
                error.status = 400;
                throw error;
            } 
            res.status(200).send({
                success: true, 
                message:"Persona creada con exito",
                result,
            });
        
        } catch(error) {
            res.status(200).send({
                success: false,
                message: error.message,
            });
        }
    }
    
    getPersonaPorId = async (req, res, next) =>{
        try {
            const {id} = req.params;
            const result = await persona.findAll({
                attributes: ["id", "nombre", "apellido", "sexo", "fechaNacimiento"],
                where: {
                    id
                }
            });
            if(result.length===0) throw new Error("No hay persona");
            // console.log("result:", result[0].dataValues);
            res.status(200).send({
                success: true,
                message: "Persona encontrada",
                result: result[0].dataValues,
            });
        } catch(error) {
            res.status(200).send({
                success: false,
                message: error.message,
            });
        }
    }

    updatePersonaPorId = async (req, res, next) =>{
        try {
            const { id } = req.params;
            const { nombre, apellido, sexo, fechaNacimiento  } = req.body;
            const result = await persona.update(
                { nombre, apellido, sexo, fechaNacimiento },
                {
                    where: {
                        id,
                    },
                }
            );
            console.log("Result:", result);
            if(result[0]===0) throw new Error("No se pudo modificar la persona");
            // if(!result) throw new Error ("No se pudo crear el producto")
            res.status(200).send({
                success: true,
                message: "Persona modificada exitosamente",
            });
        } catch(error) {
            res.status(400).send({
                success: false,
                message: error.message,
            });
        }
    }

    deletePersonaPorId = async (req, res, next) =>{
        try {
            const {id}= req.params;
            await persona.destroy({where:{
              id
            }});
        
            // Enviar una respuesta exitosa
            res.status(200).json({ message: 'Persona eliminada exitosamente' });
          } catch (error) {
            // Manejar cualquier error que ocurra durante el proceso
            res.status(500).json({ error: 'Error al eliminar la persona' });
          }
    }

    


}

export default personaController;