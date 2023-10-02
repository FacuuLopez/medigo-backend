import bcrypt from 'bcrypt';
import { usuario } from "../modelos/index.js";

const createUsers = async () => {
    try {
      const saltRounds = 10;
      const numUsers = 20;

      const users = [];
      for (let i = 1; i <= numUsers; i++) {
        const username = `user${i}@example.com`;
        const password = `password${i}`;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        const dni = `223335${i};`
        const telefono = `123456789${i}`;
        const direccion = `Calle-${i}`;
        const valoracion = Math.floor(Math.random() * 5) + 1;
        const estado = Math.floor(Math.random() * 2) + 1;;
  
        const user = {
          username,
          password: hashedPassword,
          salt,
          dni,
          telefono,
          direccion,
          valoracion,
          estado
        };
  
        users.push(user);
      }
  
      await usuario.bulkCreate(users);
      console.log('Usuarios creados exitosamente');
    } catch (error) {
      console.log(error.message);
    }
  };
  
  export default createUsers;