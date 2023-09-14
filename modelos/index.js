import Cliente from "./cliente.js";
import Consulta from "./consulta.js";
import Especialidad from "./especialidad.js";
import GrupoFamiliar from "./grupoFamiliar.js";
import Medico from "./medico.js";
import Persona from "./persona.js";
import Usuario from "./usuario.js";

Usuario.hasOne(Persona);
Persona.belongsTo(Usuario);

Medico.hasOne(Usuario);
Usuario.belongsTo(Medico);

Medico.belongsToMany(Especialidad, { through: 'Medico_Especialidad' });
Especialidad.belongsToMany(Medico, { through: 'Medico_Especialidad' });

Cliente.hasOne(Usuario);
Usuario.belongsTo(Cliente);

GrupoFamiliar.hasMany(Persona);
Persona.belongsTo(GrupoFamiliar);

Cliente.hasOne(GrupoFamiliar);
GrupoFamiliar.belongsTo(Cliente);

Consulta.hasOne(Cliente);
Cliente.belongsTo(Consulta);

Consulta.hasOne(Persona);
Persona.belongsTo(Consulta);

Consulta.hasOne(Medico);
Medico.belongsTo(Consulta);

const iniciarModelos = null;

export {
    Cliente,
    Consulta,
    Especialidad,
    GrupoFamiliar,
    Medico,
    Persona,
    Usuario,
    iniciarModelos,
}

