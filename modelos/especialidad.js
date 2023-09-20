import { Model, DataTypes as DT } from "sequelize";

class especialidad extends Model {}

especialidad.init({
    especialidad:{
        type: DT.STRING,
        allowNull: false,
    },
});

export default especialidad