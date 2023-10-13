import jwt from "jsonwebtoken"
import { usuario as modeloUsuario } from "../modelos/index.js"
if (process.env.NODE_ENV === 'development') {
    import('dotenv').then(dotenv => dotenv.config());
  }
  

const secret = process.env.JWT_SECRET;

const crearToken = (payload) => {
    return jwt.sign({ payload }, secret, {
        expiresIn: "30 days"
    });
}
export const crearTokenUsuario = (usuario) => {
    const token = crearToken({ usuario });
    const verificado = verificarToken(token);
    console.log(token);
    console.log(verificado);
    console.log(Date.now())
    return token
  }

const verificarToken = token => jwt.verify(token, secret);

const verificarTokenUsuario = async (tokenUsuario) => {
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
                    ['id', 'username'],
            }
        );
        if (!usuarioEncontrado) throw new Error('No se encontro al usuario');
        const usuarioVerificado = usuarioEncontrado.dataValues;
        return usuarioVerificado;
    } catch (error) {
        console.error('error', error)
        throw error;
    }
}

export const verificarTokenMedico = async tokenUsuario => await verificarTokenUsuario(tokenUsuario);
export const verificarTokenCliente = async tokenUsuario => await verificarTokenUsuario(tokenUsuario);

export const enviarTokenUsuario = (token, res) => res.cookie('tokenUsuario', token, { httpOnly: true, secure: true });

export const actualizarTokenUsuario = (tokenUsuario) => {
    try {
        const { exp, payload } = jwt.decode(tokenUsuario);
        const { usuario } = payload
        const { username } = usuario;
        const tiempoRestante = exp * 1000 - Date.now(); // Calcula el tiempo restante en milisegundos
        let nuevoToken = tokenUsuario;
        if (tiempoRestante < 20 * 60 * 1000) {
            // Faltan menos de 20 minutos para que expire
            nuevoToken = crearTokenUsuario({ usuario: { username } });
        }
        return nuevoToken;
    } catch (error) {
        console.error('Error al actualizar el token:', error);
        throw error;
    }
};


