import { Model, DataTypes as DT } from "sequelize";

class consulta extends Model {}

consulta.init({
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

export default consulta;