import bcrypt from 'bcrypt';
import { Model, DataTypes as DT } from "sequelize";
import sequelize from "../config/config.js";

class usuario extends Model { 
    async validatePassword(password, hash) {
        return await bcrypt.compare(password, hash);
    }
}

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
    salt: {
        type: DT.STRING,
      },
    dni: {
        type: DT.STRING(9),
        allowNull: false,
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
        sequelize,
        modelName: "usuario",
        timestamps: false,
    }
);


usuario.beforeCreate(async (usuario) => {
    const salt = await bcrypt.genSalt();
    usuario.salt = salt;
  
    const hash = await bcrypt.hash(usuario.password, salt);
    usuario.password = hash;
  });

export default usuario;
