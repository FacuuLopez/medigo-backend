# Medigo Manual de uso del servidor

Bienvenido/a a nuestra aplicación de Médicos a Domicilio. Esta guía le proporcionará todas las instrucciones necesarias para conectar nuestra aplicación de manera efectiva con nuestro servidor para poder asi hacer uso de nuestros servicios.

## Guía de Instalacion

  1. Es necesario que posea [Docker](https://www.docker.com) instalado en su dispositivo para ejecutar el servidor.
  2. Clone el repositorio en su dispositivo.
  3. Inicialice Docker.
  4. Abra una terminal en el directorio donde clono el repositorio y ejecute el comando ``` docker-compose up -d ```
     > Esto iniciara el servidor en su localhost en el puerto 3000, si quiere especificar un puerto diferente debe de modificar el archivo [docker-compose](https://docs.docker.com/compose/).

## Endpoints

### Usuarios /usuarios

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

### Clientes /clientes

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

> Para poder hacer uso del resto de los servicios del cliente es necesario que primero se haya autenticado como cliente y agregue el tokenUsuario devuelto al momento de loguearse en las peticiones.

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
### Consultas de Clientes clientes/consultas

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
- `GET: .../especialidades`
  - **Datos Requeridos:**
    *No requiere*
    - **Respuesta Exitosa:** 200 Ok
    ```json
    {
        success: true,
        message: "Especialidades encontradas",
        result: [ Lista de especialidades],
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
