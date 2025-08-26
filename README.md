# <h1 align='center'> Cliente de MCP para Cálculos Básicos usando LLM</h1>

El presente proyecto es un cliente MCP (Model Context Protocol) que usa un LLM proporcionado por Github para interactúa con un servidor MCP para realizar cálculos básicos y personalizados. Este proyecto forma parte de las prácticas realizadas durante el curso de **MCP for beginners**: `https://github.com/microsoft/mcp-for-beginners`.

## Tecnologías utilizadas

*   Node.js
*   TypeScript
*   `@modelcontextprotocol/sdk` para el protocolo MCP
*   `stdio.js` para transporte de datos
*   `dotenv` para cargar variables de entorno
*   `OpenAI GPT-4o mini` como LLM proveído por Github

## Instalación y ejecución del proyecto

Primero se debe crear un token de Github para poder usar el LLM que en este caso es `OpenAI GPT-4o mini`, esto se puede hacer de la siguiente forma:

- Dirigete a la siguiente URL: `https://github.com/marketplace/models/azure-openai/gpt-4o-mini/playground`
- Presiona el boton **<>Use this model** en la parte superior derecha, se te abrira una ventana emergente en la cual esta las indicaciones para crear el token.
- Selecciona Tokens de Acceso Personal – Haz clic en Tokens de acceso personal y luego en Generar nuevo token.
- Configura tu token – Agrega una nota para referencia, establece una fecha de expiración y selecciona los alcances necesarios (permisos).
- Genera y copia el token – Haz clic en Generar token y asegúrate de copiarlo inmediatamente, ya que no podrás verlo nuevamente.
- Una vez que tengas el token, crea un archivo `.env` en la raíz del proyecto y agrega la siguiente línea, reemplazando `your_github_token` con el token que generaste:

```
GITHUB_TOKEN=your_github_token
```

Luego, para instalar y ejecutar el proyecto, sigue estos pasos:

1.  Clone el repositorio localmente: `git clone -b 0.3-llm-client https://github.com/Juliotamara23/MCPs-Practices.git`
2.  Instale las dependencias: `npm install`
3.  Ejecute el cliente MCP con el siguiente comando: `npm start`

**Requisito previo: El servidor MCP (0.2-calculator-server) debe estar en ejecución y accesible a través del transporte definido en src/index.ts.**

## Funcionalidades del proyecto

El cliente MCP implementa las siguientes funcionalidades al interactuar con el servidor:

*   **add**: suma dos números
*   **subtract**: resta dos números
*   **multiply**: multiplica dos números
*   **divide**: divide dos números
*   **listTools**: lista todas las herramientas disponibles en el servidor
*   **callTool**:	Invoca una herramienta específica con argumentos. 

## Explicación técnica

El cliente realiza los siguientes pasos:

1. **Conexión**: Se conecta al servidor MCP usando StdioClientTransport.

```text
const transport = new StdioClientTransport({
  command: "node",
  args: ["0.2-calculator-server/build/index.js"],
});
```

**Nota**: El path del servidor debe ser el relativo y exacto por ejemplo: ``C:MCP/build/index.js``

2. **Descarga de herramientas**: Obtiene la lista de herramientas disponibles en el servidor.

3. **Generación de LLM**: Envía una pregunta al modelo GPT‑4o mini.
Ejemplo de prompt: “What is the sum of 2 and 3?”

4. **Ejecución de herramientas**: Cuando el LLM devuelve una llamada a una herramienta, el cliente invoca la herramienta correspondiente en el servidor y procesa el resultado.

### Arquitectura

- **Cliente**: Se comunica con el servidor a través de StdioClientTransport.
- **LLM**: GPT‑4o mini genera llamadas a herramientas basadas en el prompt.
- **Servidor**: Ejecuta las herramientas y devuelve resultados.

### Resultado al ejecutar
El cliente MCP te debera imprimir en consola lo siguiente:

```text
Asking server for available tools
MCPClient started on stdin/stdout
Querying LLM:  What is the sum of 2 and 3?
Making tool call
Calling tool add with args "{\"a\":2,\"b\":3}"
Tool result:  { content: [ { type: 'text', text: '5' } ] }
```