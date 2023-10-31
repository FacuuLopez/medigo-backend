import { ENUM_MEDICO_ESPECIALIDADES } from "../../utils/enums.js";
export const consultaSchema= {

    motivo: {
        in: ['body'],
        isString: {
            errorMessage: 'El motivo debe ser una cadena.',
        },
        notEmpty: {
            errorMessage: 'El motivo es obligatorio.',
        },
    },
    sintomas: {
        in: ['body'],
        isString: {
            errorMessage: 'Los síntomas deben ser una cadena.',
        },
        notEmpty: {
            errorMessage: 'Los síntomas son obligatorios.',
        },
    },
    especialidad: {
        in: ['body'],
        optional: { nullable: false },
        isIn: { options: [ENUM_MEDICO_ESPECIALIDADES],
            errorMessage: 'La especialidad del médico no es válida.', } 
    },
    precio: {
        in: ['body'],
        optional: {
            options: { nullable: true },
        },
        isDecimal: {
            errorMessage: 'El precio debe ser un número decimal válido.',
        },
        custom: {
            options: (value, { req }) => {
                if (req.body.precio !== undefined) {
                    return !isNaN(value);
                }
                return true;
            },
            errorMessage: 'El precio debe ser un número decimal válido.',
        },
    },
    tiempoLLegada: {
        in: ['body'],
        optional: {
            options: { nullable: true },
        },
        isDate: {
            errorMessage: 'El tiempo de llegada debe estar en formato DATE.',
        },
    },
    valoracionMedico: {
        in: ['body'],
        optional: {
            options: { nullable: true },
        },
        isInt: {
            options: { min: 0, max: 5 },
            errorMessage: 'La valoración del médico debe ser un número entero entre 0 y 5.',
        },
    },
    valoracionCliente: {
        in: ['body'],
        optional: {
            options: { nullable: true },
        },
        isInt: {
            options: { min: 0, max: 5 },
            errorMessage: 'La valoración del cliente debe ser un número entero entre 0 y 5.',
        },
    },
    direccion: {
        in: ['body'],
    isJSON: {
        errorMessage: 'La dirección debe ser un JSON válido.',
    },
    notEmpty: {
        errorMessage: 'La dirección es obligatoria.',
    },
},
    observacion: {
        in: ['body'],
        isString: {
            errorMessage: 'La observacion debe ser una cadena.',
        },
},
}
