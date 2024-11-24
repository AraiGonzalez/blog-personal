# Documentación de Pruebas

## Objetivo de las Pruebas

El objetivo de las pruebas es asegurar que las funcionalidades críticas de la aplicación funcionan correctamente. Esto incluye la autenticación de usuarios, la gestión de publicaciones y la gestión de usuarios. Las pruebas se realizan utilizando `supertest` para simular solicitudes HTTP y `mongodb-memory-server` para crear una base de datos en memoria, lo que permite realizar pruebas aisladas y rápidas sin afectar la base de datos real.

## Procedimiento de las Pruebas

### Configuración de la Base de Datos en Memoria

- Utilizamos `mongodb-memory-server` para crear una instancia de MongoDB en memoria.
- Antes de ejecutar las pruebas, nos conectamos a la base de datos en memoria.
- Después de ejecutar las pruebas, cerramos la conexión a la base de datos y el servidor para limpiar el entorno de pruebas.

### Pruebas de Autenticación

#### Registro de Usuario

- **Objetivo**: Verificar que un nuevo usuario puede registrarse correctamente.
- **Procedimiento**: Realizar una solicitud POST a `/auth/register` con los datos del usuario y verificar que la respuesta redirige al login y que el usuario se crea en la base de datos con el rol `user`.
- **Resultados**: La prueba debe pasar si el usuario se crea correctamente y se redirige al login.

#### Creación de Usuario Administrador

- **Objetivo**: Verificar que un usuario administrador puede ser creado correctamente.
- **Procedimiento**: Realizar una solicitud POST a `/auth/create-admin` con los datos del administrador y verificar que la respuesta contiene un mensaje de éxito y que el usuario se crea en la base de datos con el rol `admin`.
- **Resultados**: La prueba debe pasar si el usuario administrador se crea correctamente y se muestra el mensaje de éxito.

## Resultados Obtenidos

- **Pruebas de Autenticación**:
  - **Registro de Usuario**: Pasó exitosamente, el usuario se crea y se redirige al login.
  - **Creación de Usuario Administrador**: Pasó exitosamente, el usuario administrador se crea y se muestra el mensaje de éxito.
