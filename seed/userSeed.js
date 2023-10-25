import { crearNuevoCliente } from '../controladores/clientes.js';
import { crearMedico } from '../controladores/medicos.js';
import { ENUM_MEDICO_ESPECIALIDADES, ENUM_USUARIO_ESTADOS } from '../utils/enums.js';

const crearClientes = async () => {
  try {
    const numUsers = 20;
    const grupoFamiliar = [
      {
        nombre: 'hijo',
        apellido: 'prodigo',
        sexo: 'femenino',
        fechaNacimiento: new Date('2022-10-03T12:00:00')
      }
    ]
    for (let i = 1; i <= numUsers; i++) {
      const username = `cliente${i}@example.com`;
      const password = `password${i}`;
      const nombre = `cosme`;
      const apellido = 'fulanito';
      const dni = `223335${i}`;
      const telefono = `123456789${i}`;
      const direccion = `Calle-${i}`;
      const estado = ENUM_USUARIO_ESTADOS.desconenctado;
      const sexo = i % 2 === 0 ? 'F' : 'M';
      const fechaNacimiento = new Date('1990-10-03T12:00:00');

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
      };
      await crearNuevoCliente(cliente);
    }
    console.log('Usuarios creados exitosamente');
  } catch (error) {
    console.log(error.message);
  }
}

const crearMedicos = async() => {
  try {
    const numUsers = 8;
    for (let i = 1; i <= numUsers; i++) {
      const username = `medico${i}@example.com`;
      const password = `password${i}`;
      const nombre = `cosme`;
      const apellido = 'fulanito';
      const dni = `223335${i}`;
      const telefono = `123456789${i}`;
      const direccion = `Calle-${i}`;
      const estado = ENUM_USUARIO_ESTADOS.desconenctado;
      const sexo = i % 2 === 0 ? 'F' : 'M';
      const fechaNacimiento = new Date('1990-10-03T12:00:00');
      const precio = 3000;
      const radioAccion = 1.0;
      const especialidad = i % 2 ? ENUM_MEDICO_ESPECIALIDADES.clinico : ENUM_MEDICO_ESPECIALIDADES.pediatra;
      const nroMatricula = `AA123${i}`;
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
        radioAccion
      }
      const nuevoMedico = await crearMedico(medico);
    }

  } catch (error) {
    console.error(error);
  }
}

const createUsers = async () => {
  try{
    await crearClientes();
    await crearMedicos();
  }catch{

  }
};

export default createUsers;