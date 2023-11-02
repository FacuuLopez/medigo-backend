export const clienteSchema = {
    codigoPostal: {
      in: ['body'],
      isString: {
        errorMessage: 'El codigo postal debe ser una cadena.',
      },
      isLength: {
        options: { min: 2 },
        errorMessage: 'El codigo postal debe tener al menos 2 caracteres.',
      },
    },
    ciudad: {
      in: ['body'],
      isString: {
        errorMessage: 'La ciudad debe ser una cadena.',
      },
     isLength: {
        options: { min: 2 },
        errorMessage: 'La ciudad debe tener al menos 2 caracteres.',
      },
    },
    
  };