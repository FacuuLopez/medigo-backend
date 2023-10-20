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
        allowNull: true,
    },
    // lo cambie a date porque si no hay que actualizarlo permanentemente
    tiempoLLegada: {
        type: DT.DATE,
        allowNull: true,
    },
    estado: {
        type: DT.STRING,
        allowNull: false,
    },
    especialidad: {
        type: DT.STRING,
        allowNull:false,
    },
    valoracionMedico: {
        type: DT.SMALLINT,
        allowNull: true,
    },
    comentarioDelMedico:{
        type: DT.STRING,
    },
    valoracionCliente: {
        type: DT.SMALLINT,
        allowNull: true,
    },
    comentarioDelCliente: {
        type: DT.STRING
    },
    direccion: {
        type: DT.JSON,
        allowNull: false,
    }
},
    {
        sequelize
    }
);

export default consulta;