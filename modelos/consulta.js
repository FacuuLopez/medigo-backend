import { Model, DataTypes as DT } from "sequelize";
import sequelize from "../config/config.js";

class consulta extends Model { }

consulta.init({
    motivo: {
        type: DT.STRING,
        allowNull: false,

    },
    sintomas: {
        type: DT.STRING,
        allowNull: false,

    },
    precio: {
        type: DT.DECIMAL,
        allowNull: false,
    },
    tiempoLLegada: {
        type: DT.DECIMAL,
        allowNull: false,
    },
    estado: {
        type: DT.STRING,
        allowNull: false,
    },
    valoracionMedico: {
        type: DT.SMALLINT,
        allowNull: true,
    },
    valoracionCliente: {
        type: DT.SMALLINT,
        allowNull: true,
    },
},
    {
        sequelize
    }
);

export default consulta;