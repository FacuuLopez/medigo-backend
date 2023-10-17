export const validarMedico = async (req, res, next) => {
    try {
        const {id: usuarioId} = req.usuario
        const medico = await modeloMedico.findOne({
            where: {
                usuarioId: usuarioId
            }
        })
        if(!medico) throw new Error('no existe un medico para ese usuario');
        next();
    } catch (error) {
        console.error(error);
        res
            .status(401)
            .send({ success: false, result: 'no se pudo verificar al medico' });
    }
}

export const validarMatricula = async (req, res, next) => {
    const esquema = { nroMatricula: medicoSchema.nroMatricula  }
    await middlewareValidar(req, res, next, esquema);
    return
}

export const validarRadioAccion = async (req, res, next) => {
    const esquema = { radioAccion: medicoSchema.radioAccion  }
    await middlewareValidar(req, res, next, esquema);
    return
}

export const validarPrecio = async (req, res, next) => {
    const esquema = { precio: medicoSchema.precio  }
    await middlewareValidar(req, res, next, esquema);
    return
}