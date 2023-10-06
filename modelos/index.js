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

medico.belongsToMany(especialidad, { through: 'medico_especialidad' });
especialidad.belongsToMany(medico, { through: 'medico_especialidad' });

cliente.hasOne(usuario, { foreignKey: "usuarioId"});
usuario.belongsTo(cliente, { foreignKey: "usuarioId"});

grupoFamiliar.hasMany(persona, { foreignKey: "personaId"});
persona.belongsTo(grupoFamiliar, { foreignKey: "personaId"});

cliente.hasOne(grupoFamiliar, { foreignKey: "grupoFamiliarId"});
grupoFamiliar.belongsTo(cliente, { foreignKey: "grupoFamiliarId"});

grupoFamiliar.hasOne(cliente, { foreignKey: "clienteId"});
cliente.belongsTo(grupoFamiliar, { foreignKey: "clienteId"});

consulta.hasOne(cliente, { foreignKey: "clienteId"});
cliente.belongsTo(consulta, { foreignKey: "clienteId"});

consulta.hasOne(persona, { foreignKey: "personaId"});
persona.belongsTo(consulta, { foreignKey: "personaId"});

consulta.hasOne(medico, { foreignKey: "medicoId"});
medico.belongsTo(consulta, { foreignKey: "medicoId"});

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

