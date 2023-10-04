import { crearNuevoCliente } from '../controladores/clientes.js';


const createUsers = async () => {
    try {
      
      const numUsers = 20;

      for (let i = 1; i <= numUsers; i++) {
        const username = `user${i}@example.com`;
        const password = `password${i}`;
        const nombre = `cosme`;
        const apellido = 'fulanito';
        const dni = `223335${i}`;
        const telefono = `123456789${i}`;
        const direccion = `Calle-${i}`;
        const estado = 'desconectado';
        const sexo = i % 2 === 0 ? 'femenino' : 'masculino';
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
        };
  
        await crearNuevoCliente(cliente); 
      }
  
      
      console.log('Usuarios creados exitosamente');
    } catch (error) {
      console.log(error.message);
    }
  };
  
  export default createUsers;