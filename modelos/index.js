import cliente from "./cliente.js";
import consulta from "./consulta.js";
import especialidad from "./especialidad.js";
import grupoFamiliar from "./grupoFamiliar.js";
import medico from "./medico.js";
import persona from "./persona.js";
import usuario from "./usuario.js";

usuario.hasOne(persona, { foreignKey: "personaId"});
persona.belongsTo(usuario, { foreignKey: "personaId"});

medico.hasOne(usuario, { foreignKey: "usuarioId"});
usuario.belongsTo(medico, { foreignKey: "usuarioId"});

cliente.hasOne(usuario, { foreignKey: "usuarioId"});
usuario.belongsTo(cliente, { foreignKey: "usuarioId"});

grupoFamiliar.hasMany(persona, { foreignKey: "personaId"});
persona.belongsTo(grupoFamiliar, { foreignKey: "personaId"});

cliente.hasOne(grupoFamiliar, { foreignKey: "grupoFamiliarId"});
grupoFamiliar.belongsTo(cliente, { foreignKey: "grupoFamiliarId"});

cliente.hasMany(consulta);
consulta.belongsTo(cliente);

medico.hasMany(consulta);
consulta.belongsTo(medico);

persona.hasMany(consulta);
consulta.belongsTo(persona);


const iniciarModelos = null;

export {
    cliente,
    consulta,
    especialidad,
    grupoFamiliar,
    medico,
    persona,
    usuario,
    iniciarModelos,
}

