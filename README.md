# Medigo Manual de uso del servidor

## Introducción

Bienvenido al proyecto MEDIGO_BACKEND. Este proyecto es un servicio de backend para la aplicación MEDIGO, una plataforma de consultas médicas a domicilio.

## Descripción

El MEDIGO_BACKEND está diseñado para manejar todas las operaciones del lado del servidor de la aplicación MEDIGO. Proporciona APIs para la autenticación de usuarios, la gestión de perfiles de usuario, el manejo de consultas médicas y más. El backend está construido con Node.js y utiliza Sequelize para las operaciones de la base de datos.

Este README proporciona una guía completa sobre los puntos finales expuestos por el backend, los parámetros requeridos y las respuestas. También incluye una guía sobre cómo configurar y ejecutar el proyecto localmente.

Por favor, consulta la tabla de contenidos para una fácil navegación.

## Estado del Proyecto

El proyecto está actualmente en la etapa de **Despliegue**. Esto significa que todas las características principales han sido desarrolladas, probadas y están listas para ser usadas en un entorno de producción. Cualquier actualización futura en esta etapa será para correcciones de errores, mejoras de rendimiento o nuevas características menores.

## Contenido

- [Medigo Manual de uso del servidor](#medigo-manual-de-uso-del-servidor)
  - [Guía de Instalacion](#guía-de-instalacion)
  - [Endpoints](#endpoints)
    - [Usuarios](#usuarios-usuarios)
    - [Especialidades](#especialidades-especialidades)
    - [Clientes](#clientes-clientes)
    - [Manejo de consultas del lado del cliente](#manejo-de-consultas-del-lado-del-cliente-clientesconsultas)
    - [Médicos](#médicos-medicos)
    - [Manejo de consultas del lado del médico](#manejo-de-consultas-del-lado-del-médico-medicosconsultas)
  - [Contribución](#contribución)

## Guía de Instalacion

  1. Es necesario que posea [Docker](https://www.docker.com) instalado en su dispositivo para ejecutar el servidor.
  2. Clone el repositorio en su dispositivo.
  3. Inicialice Docker.
  4. Abra una terminal en el directorio donde clono el repositorio y ejecute el comando ``` docker-compose up -d ```
     > Esto iniciara el servidor en su localhost en el puerto 3000, si quiere especificar un puerto diferente debe de modificar el archivo [docker-compose](https://docs.docker.com/compose/).

## Endpoints

### Usuarios `/usuarios`

- `POST .../login`
  - **Datos Requeridos:**
    ```json
    {
      username,
      password
    }
    ```
  - **Respuesta Exitosa:** 200 Ok
    ```json
    {
            nombre,
            apellido,
            sexo,
            fechaNacimiento,
            username,
            password,
            dni,
            telefono,
            direccion,
            codigoPostal,
            ciudad,
            estado,
            grupoFamiliar,
            piso,
            departamento,
    }
    ```
    **Cookie:**
    ```
     `tokenUsuario`: [Valor del Token]
    ```
### Especialidades `/especialidades`
- `GET: .../`
  - **Datos Requeridos:**
    *No requiere*
    - **Respuesta Exitosa:** 200 Ok
    ```json
    {
        especialiedades,
    }
    ```

### Clientes `/clientes`

- `POST .../registro`
  -  **Datos Requeridos:**
    ```json
    {
        nombre,
        apellido,
        sexo,
        fechaNacimiento,
        username,
        password,
        dni,
        telefono,
        direccion,
        grupoFamiliar,
        codigoPostal,
        ciudad,
      }
    ```
  - **Respuesta Exitosa:** 200 Ok
      ```json
      {    
          success: true,
          message: "Cliente creado con exito",
      }
      ```

> Para poder hacer uso del resto de los servicios del cliente es necesario que primero se haya autenticado como cliente y agregue el tokenUsuario en el header como cookie devuelto al momento de loguearse en las peticiones.

- `PUT .../actualizar-datos`
  - **Datos Requeridos:**
    ```json
    {
        grupoFamiliar: familiares,
        username,
        password,
        telefono,
        fechaNacimiento,
        direccion,
        piso,
        departamento,
        sexo,
        codigoPostal,
        ciudad,
    }
    ```
  - **Respuesta Exitosa:** 200 Ok
    ```json
      {
        success: true,
        message: "Cliente modificado exitosamente",
      }
      ```
> Los siguientes endpoints son para administrar los miembros del grupo familiar
- `PUT: .../eliminar-miembro`
  - **Datos Requeridos:**
    ```json
    {
        nombre,
        apellido,
        fechaNacimiento
    }
    ```
    - **Respuesta Exitosa:** 200 Ok
    ```json
    {
        message: "Miembro del grupo familiar eliminado exitosamente",
        success: true,
    }
    ```
- `POST .../agregar-miembro  `
  - **Datos Requeridos:**
    ```json
    {
        nombre,
        apellido,
        sexo,
        fechaNacimiento
    }
    ```
    - **Respuesta Exitosa:** 200 Ok
    ```json
    {
        message: "Miembro del grupo familiar agregado exitosamente",
        miembroFamiliar,
        success: true,
    }
    ```
- `PUT .../modificar-miembro`
  - **Datos Requeridos:**
    ```json
    {
        nombreViejo,
        apellidoViejo,
        nombreNuevo,
        apellidoNuevo,
        sexoNuevo,
        fechaNacimientoNuevo,
        fechaNacimientoViejo,
    }
    ```
    - **Respuesta Exitosa:** 200 Ok
    ```json
    {
        message: "Miembro del grupo familiar modificado exitosamente",
        success: true,
    }
    ```
### Manejo de consultas del lado del cliente `/clientes/consultas`

- `POST: .../solicitar-consulta`
  - **Datos Requeridos:**
    ```json
    {
        sintomas,
        motivo,
        especialidad,
        latitud,
        longitud,
        nombre,
        apellido,
        direccion,
        departamento,
        piso,
    }
    ```
    - **Respuesta Exitosa:** 200 Ok
    ```json
    {
        message: "Listado de medicos",
        result: [Lista de médicos disponibles para la consulta],
    }
    ```
- `POST: .../seleccionar-medico  `
  - **Datos Requeridos:**
    ```json
    {
        nroMatricula,
        tiempoLlegada,
        horaEstimada
    }
    ```
    - **Respuesta Exitosa:** 200 Ok
    ```json
    {
          message: "Agregado médico a consulta con éxito",
          estado: [Estado de la consulta],
          hora: [Hora estimada de llegada],
    }
    ```
- `PUT: .../cancelar-consulta` > Cancela la consulta del cliente que se encuentra en curso.
  - **Datos Requeridos:**
    *No Requiere*
    - **Respuesta Exitosa:** 200 Ok
    ```json
    {
          message: "Consulta en curso cancelada con éxito",
          state: 'cancelada',
    }
    ```
- `PUT: .../remover-consulta` > Cancela la consulta del cliente que se encuentra solicitando medico.
  - **Datos Requeridos:**
    *No Requiere*
    - **Respuesta Exitosa:** 200 Ok
    ```json
    {
          message: "Consulta en curso cancelada con éxito",
          state: 'cancelada',
    }
    ```
- `PUT: .../cancelar-consulta-sin-empezar`
  - **Datos Requeridos:**
    ```json
    
    ```
    - **Respuesta Exitosa:** 200 Ok
    ```json
    {
          message: "Consulta en curso cancelada con éxito",
          state: 'cancelada',
    }
    ```
- `PUT: .../valorar-consulta`
  - **Datos Requeridos:**
    ```json
    {
        valoracion,
        comentario
    } 
    ```
    - **Respuesta Exitosa:** 200 Ok
    ```json
    {
          message: "consulta en calificacion",
          state: 'calificando',
    }
    ```
- `GET: .../historialConsultas  `
  - **Datos Requeridos:**
    *No Requiere*
    - **Respuesta Exitosa:** 200 Ok
    ```json
    {
        success: true,
        message: "Consultas encontradas",
        result: listaFinal,
    }
    ```
- `GET: .../solicitar-estado-ultima-consulta `
  - **Datos Requeridos:**
    *No requiere*
    - **Respuesta Exitosa:** 200 Ok
    ```json
    {
          message: "Consulta",
          result: [Estado de la consulta],
    }
    ```

### Médicos `/medicos`
- `POST: .../registro  `
  - **Datos Requeridos:**
    ```json
    {
        nroMatricula,
        radioAccion,
        precio,
        especialidad,
        nombre,
        apellido,
        sexo,
        fechaNacimiento,
        username,
        password,
        dni,
        telefono,
        direccion,
    }
    ```
    - **Respuesta Exitosa:** 200 Ok
    ```json
    {
          success: true,
          message: "Medico creado con exito",
    }
    ```
> Para poder hacer uso del resto de los servicios del médico es necesario que primero se haya autenticado como tal y agregue el tokenUsuario en el header como cookie devuelto al momento de loguearse en las peticiones.
- `PUT: .../actualizar-datos`
  - **Datos Requeridos:**
    ```json
    {
        nroMatricula,
        radioAccion,
        latitud,
        longitud,
        precio,
        especialidad,
        sexo,
        direccion,
        telefono,
        fechaNacimiento,
        username,
        password,
    }
    ```
    - **Respuesta Exitosa:** 200 Ok
    ```json
    {
        success: true,
        message: "Medico modificado exitosamente",
    }
    ```
- `PUT: .../actualizar-estado` > Cambia el estado entre conectado y desconectado
  - **Datos Requeridos:**
    *No requiere*
    - **Respuesta Exitosa:** 200 Ok
    ```json
    {
          estado: estadoNuevo,
    }
    ```
### Manejo de consultas del lado del médico `/medicos/consultas`
- `POST: .../aceptar-consulta`
  - **Datos Requeridos:**
    *No requiere*
    - **Respuesta Exitosa:** 200 Ok
    ```json
    {
          message: "consulta aceptada",
          state: 'en curso',
          user: 'desconectado',
    }
    ```
- `PUT: .../cancelar-consulta`
  - **Datos Requeridos:**
    *No requiere*
    - **Respuesta Exitosa:** 200 Ok
    ```json
    {
          message: "Consulta en curso cancelada con éxito",
          state: 'cancelada',
    }
    ```
- `PUT: .../rechazar-consulta `
  - **Datos Requeridos:**
    *No Requiere*
    - **Respuesta Exitosa:** 200 Ok
    ```json
    {
          message: "consulta rechazada",
          state: 'seleccionando medico',
        }
    ```
- `GET: .../solicitar-consulta `
  - **Datos Requeridos:**
    *No requerido*
    - **Respuesta Exitosa:** 200 Ok
    ```json
    {
          success: true,
          message: "Consulta",
          result: [Estado completo de la consulta],
    }
    /
    {
          success: true,
          message: "Consulta",
          result: null,
    }
    ```
- `GET: .../solicitar-estado-ultima-consulta`
  - **Datos Requeridos:**
    *No requerido*
    - **Respuesta Exitosa:** 200 Ok
    ```json
    {
          message: "Consulta",
          result: [Estado de la consulta],
        }
    ```
- `PUT: .../finalizar-consulta`
  - **Datos Requeridos:**
    *No requerido*
    - **Respuesta Exitosa:** 200 Ok
    ```json
    {
          message: "consulta en calificacion",
          state:'calificando',
    }
    ```
- ` PUT: .../valorar-consulta`
  - **Datos Requeridos:**
    ```json
    {
        valoracion,
        comentario
    }
    ```
    - **Respuesta Exitosa:** 200 Ok
    ```json
    {
          message: "consulta en calificacion",
          state: 'calificando',
    }
    ```
- `GET: .../historialConsultas `
  - **Datos Requeridos:**
    *No requerido*
    - **Respuesta Exitosa:** 200 Ok
    ```json
    {
        success: true,
        message: "Consultas encontradas",
        result: [Lista con el historial de consultas],
    }
    ```
- `PUT: /observacion-consulta`
  - **Datos Requeridos:**
    ```json
    {
        observacion
    } 
    ```
    - **Respuesta Exitosa:** 200 Ok
    ```json
    {
        success: true,
        message: "Observacion actualizada",
        result: observacion,
    }
    ```

## Contribución

- [Paula Fuentes](mailto:paulyta1983@gmail.com) - [@paulyta1983](https://github.com/paulyta1983/)
- [Mariano Di Gennaro](mailto:mariano.psico@gmail.com) - [@marianopsico](https://github.com/marianopsico/)
- [Ezequiel Korelblum](mailto:ezequiel@losko.com.ar) - [@EzeKoren](https://github.com/EzeKoren/)
- [Uriel Swarcman](mailto:urielszw@gmail.com) - [@UrielSzw](https://github.com/UrielSzw/)
- [Javier Bagdadi](mailto:javibagdadi@hotmail.com) - [@javibag](https://github.com/javibag/)
- [Federico Peirano](mailto:fedepr2345@gmail.com) - [@FedePeira](https://github.com/FedePeira/)
- [Matías Sosa](mailto:sosamatias171@gmail.com) - [@sosamatias1](https://github.com/sosamatias1/)
- [Facundo Lopez Bruno](mailto:faculopez93@hotmail.com.ar) - [@FacuuLopez](https://github.com/FacuuLopez/)
