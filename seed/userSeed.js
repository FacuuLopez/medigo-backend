import { crearNuevoCliente } from "../controladores/clientes.js";
import { crearMedico } from "../controladores/medicos.js";
import {
  ENUM_MEDICO_ESPECIALIDADES,
  ENUM_USUARIO_ESTADOS,
} from "../utils/enums.js";

import {
  NOMBRES_CLIENTES,
  APELLIDOS_CLIENTES,
  DIRECCIONES_CLIENTES,
  PISO_CLIENTES,
  DEPARTAMENTO_CLIENTES,
  CODIGO_POSTAL_CLIENTES,
  FECHAS_NACIMIENTO_CLIENTES,
  GRUPO_FAMILIAR_CLIENTE,
} from "../utils/userSeedData.js";
import {
  NOMBRES_MEDICOS,
  APELLIDOS_MEDICOS,
  DIRECCIONES_MEDICOS,
  COORDENADAS_MEDICOS,
  FECHAS_NACIMIENTO_MEDICOS,
} from "../utils/medicSeedData.js";

const GENEROS = ["M", "F"];

const crearClientes = async () => {
  try {
    const numUsers = 40;
    for (let i = 1; i <= numUsers; i++) {
      const username = `paciente${i}@gmail.com`;
      const password = "Ab.123";
      const nombre = NOMBRES_CLIENTES[i - 1];
      const apellido = APELLIDOS_CLIENTES[i - 1];
      const dni =
        Math.floor(Math.random() * (50000000 - 20000000 + 1)) + 20000000;
      const telefono =
        Math.floor(Math.random() * (1199999999 - 1111111111 + 1)) + 1111111111;
      const direccion = DIRECCIONES_CLIENTES[i - 1];
      const piso = PISO_CLIENTES[i - 1];
      const departamento = DEPARTAMENTO_CLIENTES[i - 1];
      const estado = ENUM_USUARIO_ESTADOS.desconectado;
      const sexo = GENEROS[i % 2];
      const fechaNacimiento = new Date(FECHAS_NACIMIENTO_CLIENTES[i - 1]);
      const codigoPostal = CODIGO_POSTAL_CLIENTES[i - 1];
      const ciudad = "CABA";
      const grupoFamiliar = GRUPO_FAMILIAR_CLIENTE[i - 1];

      const cliente = {
        username,
        password,
        nombre,
        apellido,
        dni,
        telefono,
        direccion,
        piso,
        departamento,
        estado,
        sexo,
        fechaNacimiento,
        codigoPostal,
        grupoFamiliar,
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
    const numUsers = 40;
    for (let i = 1; i <= numUsers; i++) {
      const username = `medico${i}@gmail.com`;
      const password = "Ab.123";
      const nombre = NOMBRES_MEDICOS[i - 1];
      const apellido = APELLIDOS_MEDICOS[i - 1];
      const dni =
        Math.floor(Math.random() * (50000000 - 20000000 + 1)) + 20000000;
      const telefono =
        Math.floor(Math.random() * (1199999999 - 1111111111 + 1)) + 1111111111;
      const direccion = DIRECCIONES_MEDICOS[i - 1];
      const estado = ENUM_USUARIO_ESTADOS.conectado;
      const sexo = GENEROS[i % 2];
      const fechaNacimiento = new Date(FECHAS_NACIMIENTO_MEDICOS[i - 1]);
      const precio = Math.floor(Math.random() * (4500 - 1200 + 1)) + 1200;
      const radioAccion = 50; // Kilómetros
      const especialidad =
        i % 2
          ? ENUM_MEDICO_ESPECIALIDADES.clinico
          : ENUM_MEDICO_ESPECIALIDADES.pediatra;
      const nroMatricula = `AA123ID${i}`;
      const { latitud, longitud } = COORDENADAS_MEDICOS[i - 1];
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
