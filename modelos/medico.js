import { Model, DataTypes as DT } from "sequelize";

class medico extends Model {}

medico.init({
    nroMatricula:{
        type: DT.INTEGER,
        allowNull: false,
        unique: true,
    },
    radioAccion:{
        type: DT.DECIMAL,
        allowNull: false,

    },
    precio: {
        type: DT.DECIMAL,
        allowNull: false,
        
    },
});

export default medico;