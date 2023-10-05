import { body } from "express-validator/src";



export const tokenUsuarioSchema = {
    in: ['cookies'],
    exists: {
        errorMessage: 'El token JWT no está presente en la cookie.',
    },
    isJWT: {
        errorMessage: 'El token JWT no tiene un formato válido.',
    },
};

export const usuarioSchema = [
  body("username")
    .isString()
    .notEmpty()
    .withMessage("El nombre de usuario es obligatorio")
    .isLength({ min: 4 })
    .isEmail()
    .withMessage("El nombre de usuario debe tener al menos 4 caracteres"),
  
  body("password")
    .isString()
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  
  body("dni")
    .isString()
    .notEmpty()
    .withMessage("El DNI es obligatorio")
    .isLength({ min: 7, max: 8 })
    .withMessage("El DNI debe tener 7 u 8 caracteres"),
  
  body("telefono")
    .isString()
    .notEmpty()
    .withMessage("El teléfono es obligatorio"),
  
  body("direccion") //A CHEQUEAR CON EL FRONT, PODRIA SER STRING (ya que no se utiliza para calculo de distancia)
    .isJSON()
    .notEmpty()
    .withMessage("La dirección es obligatoria"),
  
]

