import { Model, DataTypes as DT } from "sequelize";

class EspecialidadMedico extends Model {}

EspecialidadMedico.init({
    tarifa:{},
})

export default EspecialidadMedico;