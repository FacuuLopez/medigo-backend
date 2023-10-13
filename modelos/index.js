import cliente from "./cliente.js";
import consulta from "./consulta.js";
import grupoFamiliar from "./grupoFamiliar.js";
import medico from "./medico.js";
import persona from "./persona.js";
import usuario from "./usuario.js";

persona.hasOne(usuario);
usuario.belongsTo(persona);

usuario.hasOne(medico);
medico.belongsTo(usuario);

usuario.hasOne(cliente);
cliente.belongsTo(usuario);

grupoFamiliar.hasMany(persona);
persona.belongsTo(grupoFamiliar);

grupoFamiliar.hasOne(cliente);
cliente.belongsTo(grupoFamiliar);

cliente.hasMany(consulta);
consulta.belongsTo(cliente);

medico.hasMany(consulta);
consulta.belongsTo(medico);

persona.hasMany(consulta);
consulta.belongsTo(persona);

<<<<<<< HEAD
consulta.hasOne(persona, { foreignKey: "personaId"});
persona.belongsTo(consulta, { foreignKey: "personaId"});

consulta.hasOne(medico, { foreignKey: "medicoId"});
medico.belongsTo(consulta, { foreignKey: "medicoId"});
=======
>>>>>>> upstream/main

const iniciarModelos = null;

export {
    cliente,
    consulta,
    grupoFamiliar,
    medico,
    persona,
    usuario,
    iniciarModelos,
}

