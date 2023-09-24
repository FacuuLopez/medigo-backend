import cliente from "./cliente.js";
import consulta from "./consulta.js";
import especialidad from "./especialidad.js";
import grupoFamiliar from "./grupoFamiliar.js";
import medico from "./medico.js";
import persona from "./persona.js";
import usuario from "./usuario.js";

usuario.hasOne(persona, { foreingKey: "personaId"});
persona.belongsTo(usuario, { foreingKey: "personaId"});

medico.hasOne(usuario, { foreingKey: "usuarioId"});
usuario.belongsTo(medico, { foreingKey: "usuarioId"});

medico.belongsToMany(especialidad, { through: 'medico_especialidad' });
especialidad.belongsToMany(medico, { through: 'medico_especialidad' });

cliente.hasOne(usuario, { foreingKey: "usuarioId"});
usuario.belongsTo(cliente, { foreingKey: "usuarioId"});

grupoFamiliar.hasMany(persona, { foreingKey: "personaId"});
persona.belongsTo(grupoFamiliar, { foreingKey: "personaId"});

cliente.hasOne(grupoFamiliar, { foreingKey: "grupoFamiliarId"});
grupoFamiliar.belongsTo(cliente, { foreingKey: "grupoFamiliarId"});

grupoFamiliar.hasOne(cliente, { foreingKey: "clienteId"});
cliente.belongsTo(grupoFamiliar, { foreingKey: "clienteId"});

consulta.hasOne(cliente, { foreingKey: "clienteId"});
cliente.belongsTo(consulta, { foreingKey: "clienteId"});

consulta.hasOne(persona, { foreingKey: "personaId"});
persona.belongsTo(consulta, { foreingKey: "personaId"});

consulta.hasOne(medico, { foreingKey: "medicoId"});
medico.belongsTo(consulta, { foreingKey: "medicoId"});

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

