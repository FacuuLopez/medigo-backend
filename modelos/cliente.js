import { Model, DataTypes as DT } from "sequelize";
import sequelize from "../config/config.js";

class cliente extends Model { }

cliente.init({

},
{
    sequelize
}
);

export default cliente;