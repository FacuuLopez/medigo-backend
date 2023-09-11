import { Model, DataTypes as DT } from "sequelize";

class Consulta extends Model {}

Consulta.init({
    motivo:{

    },
    sintomas:{

    },
    precio:{

    },
    tiempoLLegada:{

    },
    estado:{

    },
    valoracionMedico:{

    },
    valoracionCliente:{

    },
});

export default Consulta;