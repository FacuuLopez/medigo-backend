import { Model, DataTypes as DT } from "sequelize";

class usuario extends Model {}

usuario.init({
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
    valoracion:{

    },
    estado:{

    },
});

export default usuario;
