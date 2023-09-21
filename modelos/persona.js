import { Model, DataTypes as DT } from "sequelize";
import sequelize from "../config/config.js";

class persona extends Model { }

persona.init({
    nombre: {
        type: DT.STRING,
        allowNull: false,
    },
    apellido: {
        type: DT.STRING,
        allowNull: false,
    },
    sexo: {
        type: DT.CHAR,
        allowNull: false,
    },
    fechaNacimiento: {
        type: DT.DATE,
        allowNull: false,
    }
},
    {
        sequelize
    }
);

export default persona;