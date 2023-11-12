import { Model, DataTypes as DT } from "sequelize";
import sequelize from "../config/config.js";

class consulta extends Model {}

consulta.init(
  {
    motivo: {
      type: DT.STRING,
      allowNull: false,
    },
    sintomas: {
      type: DT.STRING,
      allowNull: false,
    },
    precio: {
      type: DT.DECIMAL,
      allowNull: true,
    },
    tiempoLlegada: {
      type: DT.DECIMAL,
      allowNull: true,
    },
    estado: {
      type: DT.STRING,
      allowNull: false,
    },
    especialidad: {
      type: DT.STRING,
      allowNull: false,
    },
    valoracionMedico: {
      type: DT.SMALLINT,
      allowNull: true,
    },
    comentarioDelMedico: {
      type: DT.STRING,
      allowNull: true,
    },
    valoracionCliente: {
      type: DT.SMALLINT,
      allowNull: true,
    },
    comentarioDelCliente: {
      type: DT.STRING,
      allowNull: true,
    },
    direccion: {
      type: DT.JSON,
      allowNull: false,
    },
    piso: {
      type: DT.STRING,
      allowNull: true,
    },
    departamento: {
      type: DT.STRING,
      allowNull: true,
    },
    observacion: {
      type: DT.STRING,
      allowNull: true,
    },
    fechaSeleccion: {
      type: DT.DATE,
      allowNull: true,
    },
    latitudCliente: {
      type: DT.DECIMAL,
      allowNull: true,
    },
    longitudCliente: {
      type: DT.DECIMAL,
      allowNull: true,
    },
  },
  {
    sequelize,
  }
);

export default consulta;
