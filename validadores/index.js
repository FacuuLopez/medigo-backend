import { checkSchema, validationResult } from "express-validator";

export const middlewareValidar = async (req, res, next, esquema) => {
    try {
        await checkSchema(esquema).run(req);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          console.error('array errors', errors.array());
          const mapaErrores = errors.array().map(error => error.msg);
          next(new Error(mapaErrores)) ;
        }
        next()
    } catch (error) {
         next(error)
    }
}