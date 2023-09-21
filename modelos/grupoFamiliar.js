import { Model, DataTypes as DT } from "sequelize";
import sequelize from "../config/config.js";

class grupoFamiliar extends Model {}

grupoFamiliar.init({
    
},
{
    sequelize
}
);

export default grupoFamiliar;