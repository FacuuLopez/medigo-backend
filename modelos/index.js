import Cliente from "./cliente";
import Consulta from "./consulta";
import Especialidad from "./especialidad";
import EspecialidadMedico from "./especialidadMedico";
import GrupoFamiliar from "./grupoFamiliar";
import Medico from "./medico";
import Persona from "./persona";
import Usuario from "./usuario";

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



