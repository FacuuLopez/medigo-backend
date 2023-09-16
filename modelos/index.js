import cliente from "./cliente.js";
import consulta from "./consulta.js";
import especialidad from "./especialidad.js";
import grupoFamiliar from "./grupoFamiliar.js";
import medico from "./medico.js";
import persona from "./persona.js";
import usuario from "./usuario.js";

usuario.hasOne(persona);
persona.belongsTo(usuario);

medico.hasOne(usuario);
usuario.belongsTo(medico);

medico.belongsToMany(especialidad, { through: 'medico_especialidad' });
especialidad.belongsToMany(medico, { through: 'medico_especialidad' });

cliente.hasOne(usuario);
usuario.belongsTo(cliente);

grupoFamiliar.hasMany(persona);
persona.belongsTo(grupoFamiliar);

cliente.hasOne(grupoFamiliar);
grupoFamiliar.belongsTo(cliente);

consulta.hasOne(cliente);
cliente.belongsTo(consulta);

consulta.hasOne(persona);
persona.belongsTo(consulta);

consulta.hasOne(medico);
medico.belongsTo(consulta);

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

