import { body } from "express-validator"

export const consultaSchema = [

    body("motivo")
        .isString()
        .notEmpty()
        .withMessage("El motivo es obligatorio"),

    body("sintomas")
        .isString()
        .notEmpty()
        .withMessage("Los síntomas son obligatorios"),

    body("precio")
        .optional()
        .isDecimal({ decimal_digits: "2" })
        .withMessage("El precio debe ser un número decimal válido"),

    body("tiempoLLegada")
        .optional()
        .isDate()
        .withMessage("El tiempo de llegada debe estar en formato DATE"),

    body("valoracionMedico")
        .optional()
        .isInt({ min: 0, max: 5 })
        .withMessage("La valoración del médico debe ser un número entero entre 0 y 5"),

    body("valoracionCliente")
        .optional()
        .isInt({ min: 0, max: 5 })
        .withMessage("La valoración del cliente debe ser un número entero entre 0 y 5"),

    body("direccion")
        .isJSON()
        .notEmpty()
        .withMessage("La dirección es obligatoria y debe ser un JSON")
];


