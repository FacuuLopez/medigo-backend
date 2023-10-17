export const medicoSchema = {

  nroMatricula: {
    in: ['body'],
    isString: {
      errorMessage: 'El número de matrícula debe ser una cadena.',
    },
    notEmpty: {
      errorMessage: 'El número de matrícula es obligatorio.',
    },
    isLength: {
      options: { min: 6 },
      errorMessage: 'El número de matrícula debe tener al menos 6 caracteres.',
    },
  },
  radioAccion: {
    in: ['body'],
    isDecimal: {
      errorMessage: 'El radio de acción debe ser un número decimal válido.',
    },
    notEmpty: {
      errorMessage: 'El radio de acción es obligatorio.',
    },
  },
  precio: {
    in: ['body'],
    isDecimal: {
      errorMessage: 'El precio debe ser un número decimal válido.',
    },
    notEmpty: {
      errorMessage: 'El precio es obligatorio.',
    },
    custom: {
      options: (value) => value >= 1000,
      errorMessage: 'El precio debe ser igual o mayor a 1000.',
    },
  }
}

  