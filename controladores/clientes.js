import { cliente, grupoFamiliar } from "../modelos/index.js";



class clientesController {
    constructor() {}

    createCliente = async (req, res, next) =>{
        try{

            const { usuarioId, grupoFamiliarId } = req.body;
            const result = await cliente.create({usuarioId, grupoFamiliarId  });
            if(!result){
                const error = new Error("No se pudo crear al cliente");
                error.status = 400;
                throw error;
            } 
            const result2 = await grupoFamiliar.create({clientId: result.id})
            if(!result2){
                const error = new Error("No se pudo crear el grupo familiar");
                error.status = 400;
                throw error;
            }
            res.status(200).send({
                success: true, 
                message:"Cliente creado con exito",
                result,
            });
        
        } catch(error) {
            res.status(200).send({
                success: false,
                message: error.message,
            });
        }
    }
    
    getClientePorId = async (req, res, next) =>{
        try {
            const {id} = req.params;
            const result = await cliente.findAll({
                attributes: ["id", "usuarioId", "grupoFamiliarId"],
                where: {
                    id
                }
            });
            if(result.length===0) throw new Error("No hay cliente");
            // console.log("result:", result[0].dataValues);
            res.status(200).send({
                success: true,
                message: "Cliente encontrado",
                result: result[0].dataValues,
            });
        } catch(error) {
            res.status(200).send({
                success: false,
                message: error.message,
            });
        }
    }

    updateClientePorId = async (req, res, next) =>{
        try {
            const { id } = req.params;
            const { usuarioId, grupoFamiliarId } = req.body;
            const result = await cliente.update(
                {usuarioId, grupoFamiliarId },
                {
                    where: {
                        id,
                    },
                }
            );
            console.log("Result:", result);
            if(result[0]===0) throw new Error("No se pudo modificar el cliente");
            // if(!result) throw new Error ("No se pudo crear el producto")
            res.status(200).send({
                success: true,
                message: "Cliente modificado exitosamente",
            });
        } catch(error) {
            res.status(400).send({
                success: false,
                message: error.message,
            });
        }
    }

    deleteClientePorId = async (req, res, next) =>{
        try {
            const {id}= req.params;
            await cliente.destroy({where:{
              id
            }});
        
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