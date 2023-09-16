import { Model, DataTypes as DT } from "sequelize";

class persona extends Model {}

persona.init({
    nombre:{

    },
    apellido:{

    },
    sexo:{

    }, 
    fechaNacimiento:{

    }
});

export default persona;