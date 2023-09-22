export const tokenUsuarioSchema = {
    in: ['cookies'],
    exists: {
        errorMessage: 'El token JWT no está presente en la cookie.',
    },
    isJWT: {
        errorMessage: 'El token JWT no tiene un formato válido.',
    },
};