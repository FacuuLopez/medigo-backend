import { body } from "express-validator/src";

export const medicoSchema = [
    body("nroMatricula")
      .isString()
      .notEmpty()
      .withMessage("El numero de matricula es obligatorio")
      .isLength({ min: 6 })
      .withMessage("El nombre de usuario debe tener al menos 6 caracteres"),
    
    body("radioAccion")
      .isDecimal()
      .notEmpty()
      .withMessage("El radio de accion es obligatorio"),

    body("precio")
      .isDecimal()
      .notEmpty()
      .withMessage("El precio es obligatorio")
      .custom((value) => value >= 1000)
      .withMessage("El precio debe ser igual o mayor a 1000"),
  ]