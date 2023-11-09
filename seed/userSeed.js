import { crearNuevoCliente } from "../controladores/clientes.js";
import { crearMedico } from "../controladores/medicos.js";
import {
  ENUM_MEDICO_ESPECIALIDADES,
  ENUM_USUARIO_ESTADOS,
} from "../utils/enums.js";
import coords from "../utils/coords.js";

const crearClientes = async () => {
  try {
    const numUsers = 20;
    const grupoFamiliar = [
      {
        nombre: "hijo",
        apellido: "prodigo",
        sexo: "femenino",
        fechaNacimiento: new Date("2022-10-03T12:00:00"),
      },
    ];
    for (let i = 1; i <= numUsers; i++) {
      const username = `cliente${i}@example.com`;
      const password = `password${i}`;
      const nombre = `cosme`;
      const apellido = "fulanito";
      const dni = `223335${i}`;
      const telefono = `123456789${i}`;
      const direccion = `Calle-${i}`;
      const estado = ENUM_USUARIO_ESTADOS.desconectado;
      const sexo = i % 2 === 0 ? "F" : "M";
      const fechaNacimiento = new Date("1990-10-03T12:00:00");
      const codigoPostal = "1010";
      const ciudad = "CABA";

      const cliente = {
        username,
        password,
        nombre,
        apellido,
        dni,
        telefono,
        direccion,
        estado,
        sexo,
        fechaNacimiento,
        grupoFamiliar,
        codigoPostal,
        ciudad,
      };
      await crearNuevoCliente(cliente);
    }
    console.log("Usuarios creados exitosamente");
  } catch (error) {
    console.log(error.message);
  }
};

const crearMedicos = async () => {
  try {
    const numUsers = 25;
    for (let i = 1; i <= numUsers; i++) {
      const username = `medico${i}@example.com`;
      const password = `password${i}`;
      const nombre = `cosme`;
      const apellido = "fulanito";
      const dni = `223335${i}`;
      const telefono = `123456789${i}`;
      const direccion = `Calle-${i}`;
      const estado = ENUM_USUARIO_ESTADOS.conectado;
      const sexo = i % 2 === 0 ? "F" : "M";
      const fechaNacimiento = new Date("1990-10-03T12:00:00");
      const precio = Math.floor(Math.random() * (4500 - 1200 + 1)) + 1200;
      const radioAccion = 5000;
      const especialidad =
        i % 2
          ? ENUM_MEDICO_ESPECIALIDADES.clinico
          : ENUM_MEDICO_ESPECIALIDADES.pediatra;
      const nroMatricula = `AA123${i}`;
      const { latitud, longitud } = coords.pop();
      const medico = {
        username,
        password,
        nombre,
        apellido,
        dni,
        telefono,
        direccion,
        estado,
        sexo,
        fechaNacimiento,
        precio,
        especialidad,
        nroMatricula,
        radioAccion,
        latitud,
        longitud,
      };
      const nuevoMedico = await crearMedico(medico);
    }
  } catch (error) {
    console.error(error);
  }
};

const createUsers = async () => {
  try {
    await crearClientes();
    await crearMedicos();
  } catch {}
};

export default createUsers;
