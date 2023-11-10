export const usuarioSchema = {
  username: {
    in: ["body"],
    isString: {
      errorMessage: "El nombre de usuario debe ser una cadena.",
    },
    notEmpty: {
      errorMessage: "El nombre de usuario es obligatorio.",
    },
    isLength: {
      options: { min: 4 },
      errorMessage: "El nombre de usuario debe tener al menos 4 caracteres.",
    },
    isEmail: {
      errorMessage: "El email no es válido.",
    },
  },
  password: {
    in: ["body"],
    isString: {
      errorMessage: "La contraseña debe ser una cadena.",
    },
    notEmpty: {
      errorMessage: "La contraseña es obligatoria.",
    },
    isLength: {
      options: { min: 6 },
      errorMessage: "La contraseña debe tener al menos 6 caracteres.",
    },
  },
  // TODO: ver validaciones del login 
  // credentials: {
  //   in: ['body'],
  //   custom: {
  //     options: async (value, { req }) => {
  //       const { username, password } = req.body;

  //       if (username && password) {
  //         const user = await usuario.findone({ where: { username } });

  //         if (!user || !user.validarpassword(password)) {
  //           req.errormessage = 'credenciales incorrectas';
  //         }
  //       } else {
  //         req.errormessage = 'credenciales no proporcionadas';
  //       }
  //     },
  //   },
  // },
  dni: {
    in: ["body"],
    isString: {
      errorMessage: "El DNI debe ser una cadena.",
    },
    notEmpty: {
      errorMessage: "El DNI es obligatorio.",
    },
    isLength: {
      options: { min: 7, max: 8 },
      errorMessage: "El DNI debe tener 7 u 8 caracteres.",
    },
  },
  telefono: {
    in: ["body"],
    isString: {
      errorMessage: "El teléfono debe ser una cadena.",
    },
    notEmpty: {
      errorMessage: "El teléfono es obligatorio.",
    },
  },
  direccion: {
    in: ["body"],
    isJSON: {
      errorMessage: "La dirección debe ser un JSON válido.",
    },
    notEmpty: {
      errorMessage: "La dirección es obligatoria.",
    },
  },
};

export const tokenUsuarioSchema = {
  tokenUsuario: {
    in: ["cookies"],
    exists: {
      errorMessage: "El token JWT no está presente en la cookie.",
    },
    isJWT: {
      errorMessage: "El token JWT no tiene un formato válido.",
    },
  },
};
