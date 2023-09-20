import { Model, DataTypes as DT } from "sequelize";

class consulta extends Model {}

consulta.init({
    motivo:{
        type: DT.STRING,
        allowNull: false,

    },
    sintomas:{
        type: DT.STRING,
        allowNull: false,
        
    },
    precio:{
        type: DT.DECIMAL,
        allowNull: false,
    },
    tiempoLLegada:{
        type: DT.DECIMAL,
        allowNull: false,
    },
    estado:{
        type: DT.TINYINT,
        allowNull: false,
    },
    valoracionMedico:{
        type: DT.TINYINT,
        allowNull: true,
    },
    valoracionCliente:{
        type: DT.TINYINT,
        allowNull: true,
    },
});

export default consulta;