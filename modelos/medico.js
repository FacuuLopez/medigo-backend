import { Model, DataTypes as DT } from "sequelize";
import sequelize from "../config/config.js";

class medico extends Model { }

medico.init({
    nroMatricula: {
        type: DT.STRING,
        allowNull: false,
        unique: true,
    },
    radioAccion: {
        type: DT.DECIMAL,
        allowNull: false,
    },
    precio: {
        type: DT.DECIMAL,
        allowNull: false,
    },
    latitud: {
        type: DT.DECIMAL,
    },
    longitud: {
        type: DT.DECIMAL,
    },
    especialidad:{
        type: DT.STRING
    }
},
    {
        sequelize
    }
);

export default medico;