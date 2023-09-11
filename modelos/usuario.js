import { Model, DataTypes as DT } from "sequelize";

class Usuario extends Model {}

Usuario.init({
    username:{

    },
    password:{

    },
    dni:{

    },
    telefono:{

    },
    direccion: {

    },
    estado:{

    },
});

export default Usuario;