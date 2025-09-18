# <h1 aling='center'> Calculator Client con Model Context Protocol </h1>

El presente proyecto es un cliente MCP (Model Context Protocol) que interactúa con un servidor MCP para realizar cálculos básicos y personalizados. Este proyecto forma parte de las prácticas realizadas durante el curso de **MCP for beginners**: `https://github.com/microsoft/mcp-for-beginners`.

## Tecnologías utilizadas

*   Node.js
*   TypeScript
*   `@modelcontextprotocol/sdk` para el protocolo MCP
*   `stdio.js` para transporte de datos

## Instalación y ejecución del proyecto

1.  Clone el repositorio localmente: `git clone -b 0.2-calculator-client https://github.com/username/calculator-client.git`
2.  Instale las dependencias: `npm install`
3.  Ejecute el cliente MCP con el siguiente comando: `npm start`

## Funcionalidades del proyecto

El cliente MCP implementa las siguientes funcionalidades al interactuar con el servidor:

*   **add**: suma dos números
*   **subtract**: resta dos números
*   **multiply**: multiplica dos números
*   **divide**: divide dos números
*   **help**: muestra la ayuda y las instrucciones de uso para cada herramienta
*   **listTools**: lista todas las herramientas disponibles en el servidor
*   **listResources**: lista los recursos disponibles en el servidor
*   **listPrompts**: lista los prompts disponibles en el servidor y permite probarlos

## Explicación técnica

El cliente MCP se crea utilizando la clase `Client` de la biblioteca `@modelcontextprotocol/sdk`. Se define un transporte utilizando la clase `StdioClientTransport` para conectarse al servidor MCP.

### Flujo de ejecución

1. **Conexión al servidor MCP**: El cliente establece la conexión utilizando el transporte definido.
2. **Listado de herramientas**: Se consulta al servidor para obtener las herramientas disponibles.
3. **Ejecución de herramientas**: El cliente ejecuta herramientas como `add`, `subtract`, `multiply`, y `divide`.
4. **Gestión de recursos**: Se listan y leen los recursos disponibles en el servidor.
5. **Gestión de prompts**: El cliente lista los prompts disponibles y prueba el primero si está disponible.

### Manejo de resultados

Los resultados se procesan utilizando la función `extractTextResult`, que extrae el contenido textual de las respuestas del servidor, asegurando que los datos se presenten de manera legible y útil.

## Ejecución de pruebas

El cliente MCP incluye pruebas para validar las herramientas y los flujos básicos. Asegúrese de que el servidor MCP esté ejecutándose antes de iniciar el cliente.