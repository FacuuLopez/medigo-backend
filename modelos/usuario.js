import { Model, DataTypes as DT } from "sequelize";

class usuario extends Model {}

usuario.init({
    username:{
        type: DT.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail:true
        }
    },
    password:{
        type: DT.STRING,
        allowNull: false,
    },
    dni:{
        type: DT.STRING,
        allowNull: false,
        validate:{
            len:[7]
        }
    },
    telefono:{
        type: DT.STRING,
        allowNull: false,
    },
    direccion: {
        type: DT.STRING,
        allowNull: false,
    },
    valoracion:{
        type: DT.TINYINT,
        allowNull: true,
    },
    estado:{
        type: DT.TINYINT,
        allowNull: false,
    },
});

export default usuario;
