import { Model, DataTypes as DT } from "sequelize";
import sequelize from "../config/config.js";

class usuario extends Model { }

usuario.init({
    username: {
        type: DT.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DT.STRING,
        allowNull: false,
    },
    dni: {
        type: DT.STRING,
        allowNull: false,
        validate: {
            len: [9]
        }
    },
    telefono: {
        type: DT.STRING,
        allowNull: false,
    },
    direccion: {
        type: DT.JSON,
        allowNull: false,
    },
    valoracion: {
        type: DT.SMALLINT,
        allowNull: true,
    },
    estado: {
        type: DT.STRING,
        allowNull: false,
    },
},
    {
        sequelize
    }
);

export default usuario;
