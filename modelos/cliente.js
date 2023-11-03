import { Model, DataTypes as DT } from "sequelize";
import sequelize from "../config/config.js";

class cliente extends Model { }

cliente.init({
    codigoPostal: {
        type: DT.STRING,
        allowNull: true,
    },
    ciudad: {
        type: DT.STRING,
        allowNull: true,
    },
},
{
    sequelize
}
);

export default cliente;