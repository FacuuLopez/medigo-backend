import { Model, DataTypes as DT } from "sequelize";
import sequelize from "../config/config.js";

class especialidad extends Model { }

especialidad.init({
    especialidad: {
        type: DT.STRING,
        allowNull: false,
    },
},
    {
        sequelize
    }
);

export default especialidad