import jwt from "jsonwebtoken"
import { usuario as modeloUsuario } from "../modelos/index.js"

const secret = process.env.JWT_SECRET;

const crearToken = (payload) => {
    return jwt.sign({ payload }, secret, {
        expiresIn: '30m'
    });
}
export const crearTokenUsuario = (usuario) => crearToken({ usuario });

const verificarToken = token => jwt.verify(token, secret);

const verificarTokenUsuario = async (tokenUsuario, tipoUsuario) => {
    try {
        const { payload } = verificarToken(tokenUsuario);
        const { usuario } = payload;
        const { username } = usuario;
        //verificar si el usuario existe
        const usuarioEncontrado = await modeloUsuario.findOne(
            {
                where: {
                    username
                },
                attributes:
                    ['id', 'username', 'tipo'],
            }
        );
        if (!usuarioEncontrado) throw new Error('No se encontro al usuario');
        const usuarioVerificado = usuarioEncontrado.dataValues;
        const { tipo } = usuarioVerificado;
        if (tipo !== tipoUsuario) throw new Error(`El usuario no es un ${tipoUsuario}`);
        return usuarioVerificado;
    } catch (error) {
        throw error;
    }
}

export const verificarTokenMedico = async tokenUsuario => verificarTokenUsuario(tokenUsuario, 'medico');
export const verificarTokenCliente = async tokenUsuario => verificarTokenUsuario(tokenUsuario, 'cliente');

export const enviarTokenUsuario = (token, res) => res.cookie('tokenUsuario', token, { httpOnly: true, secure: true });

export const actualizarTokenUsuario = (tokenUsuario) => {
    const { exp, payload } = jwt.decode(tokenUsuario);
    const { usuario } = payload
    const { username } = usuario;
    const tiempoRestante = exp * 1000 - Date.now(); // Calcula el tiempo restante en milisegundos
    let nuevoToken = tokenUsuario;
    if (tiempoRestante < 20 * 60 * 1000) {
        //faltan menos de 20 minutos para que expire
        nuevoToken = crearTokenUsuario({ username });
    }
    return nuevoToken;
};

