import { ENUM_MEDICO_ESPECIALIDADES } from "../utils/enums.js"

export default class EspecialidadesController {
    constructor() {}

    devolverEspecialidades = (req, res, next) => {
        try {
             const especialiedades = Object.values(ENUM_MEDICO_ESPECIALIDADES);
             res.status(200).json(especialiedades)
        } catch (error) {
             res.status(400)
        }
    }

}