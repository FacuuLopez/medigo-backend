export const personaSchema = {
    nombre: {
      in: ['body'],
      isString: {
        errorMessage: 'El nombre debe ser una cadena.',
      },
      notEmpty: {
        errorMessage: 'El nombre es obligatorio.',
      },
      isLength: {
        options: { min: 2 },
        errorMessage: 'El nombre debe tener al menos 2 caracteres.',
      },
    },
    apellido: {
      in: ['body'],
      isString: {
        errorMessage: 'El apellido debe ser una cadena.',
      },
      notEmpty: {
        errorMessage: 'El apellido es obligatorio.',
      },
      isLength: {
        options: { min: 2 },
        errorMessage: 'El apellido debe tener al menos 2 caracteres.',
      },
    },
    sexo: {
      in: ['body'],
      isString: {
        errorMessage: 'El sexo debe ser una cadena.',
      },
      notEmpty: {
        errorMessage: 'El sexo es obligatorio.',
      },
      isIn: {
        options: [['M', 'F', 'O']],
        errorMessage: "El sexo debe ser 'M', 'F' u 'O'.",
      },
    },
    fechaNacimiento: {
      in: ['body'],
      isDate: {
        errorMessage: 'La fecha de nacimiento debe ser una fecha válida.',
      },
      notEmpty: {
        errorMessage: 'La fecha de nacimiento es obligatoria.',
      },
    },
  };

