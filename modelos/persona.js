import { Model, DataTypes as DT } from "sequelize";

class persona extends Model {}

persona.init({
    nombre:{
        type: DT.STRING,
        allowNull: false,
    },
    apellido:{        
        type: DT.STRING,
        allowNull: false,
    },
    sexo:{        
        type: DT.CHAR,
        allowNull: false,
        }, 
    fechaNacimiento:{
        type: DT.DATE,
        allowNull: false,
    }
});

export default persona;