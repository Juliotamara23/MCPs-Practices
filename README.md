# Calculator Server con Model Context Protocol

El presente proyecto es un servidor MCP (Model Context Protocol) que ofrece varias herramientas útiles para realizar cálculos básicos y personalizados. El objetivo principal de este proyecto es practicar lo aprendido durante el curso de **MCP for beginers**: `https://github.com/microsoft/mcp-for-beginners`.

## Tecnologías utilizadas

*   Node.js
*   TypeScript
*   `@modelcontextprotocol/sdk` para el protocolo MCP
*   `zod` para validación de datos
*   `stdio.js` para transporte de datos

## Instalación y ejecución del proyecto

1.  Clone el repositorio localmente: `git clone -b 0.2-calculator-server https://github.com/username/calculator-server.git`
2.  Instale las dependencias: `npm install`
3.  Ejecuta el comando de construcción y ejecución: `npm run build` y luego `npm start`

## Funcionalidades del proyecto

El proyecto implementa un servidor MCP que ofrece varias herramientas:

*   **add**: suma dos números
*   **subtract**: resta dos números
*   **multiply**: multiplica dos números
*   **divide**: divide dos números
*   **help**: muestra la ayuda y las instrucciones de uso para cada herramienta
*   **greeting**: muestra un mensaje personalizado con el nombre del usuario

## Explicación técnica

El servidor MCP se crea utilizando la clase `McpServer` de la biblioteca `@modelcontextprotocol/sdk`. Se definen varias herramientas utilizando la función `tool`, que toma como argumento el nombre de la herramienta, una estructura de datos para validación y una función que devuelve el contenido de la respuesta.

La herramienta `greeting` se define utilizando la clase `ResourceTemplate` y la función `resource`. Esta función permite agregar recursos dinámicos al servidor MCP.

El servidor MCP se conecta a un transporte de datos utilizando la clase `StdioServerTransport`, lo que permite recibir mensajes en el estándar de entrada y enviar mensajes en el estándar