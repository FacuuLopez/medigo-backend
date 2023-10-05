import { body } from "express-validator";

export const personaSchema = [

    body("nombre")
    .isString()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ min: 2 })
    .withMessage("El nombre debe tener al menos 2 caracteres"),
  
    body("apellido")
    .isString()
    .notEmpty()
    .withMessage("El apellido es obligatorio")
    .isLength({ min: 2 })
    .withMessage("El apellido debe tener al menos 2 caracteres"),
    
    body("sexo")
    .isString()
    .notEmpty()
    .withMessage("El sexo es obligatorio")
    .isIn(["M", "F", "O"])
    .withMessage("El sexo debe ser 'M', 'F' u 'O'"),
    
    body("fechaNacimiento")
    .isDate()
    .notEmpty()
    .withMessage("La fecha de nacimiento es obligatoria."),
    
]