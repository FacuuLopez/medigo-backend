import { Model, DataTypes as DT } from "sequelize";

class Persona extends Model {}

Persona.init({
    nombre:{

    },
    apellido:{

    },
    sexo:{

    }, 
    fechaNacimiento:{

    }
});

export default Persona;