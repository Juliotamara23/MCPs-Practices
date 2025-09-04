# <h1 align="center">Servidor MCP con mecanismo de transporte SSE</h1>

## Descripción
Este proyecto implementa un servidor MCP (Model Context Protocol) que expone varias herramientas a través de un transporte Server‑Sent Events (SSE).
El servidor permite a los clientes conectarse mediante SSE, enviar mensajes POST y recibir respuestas en tiempo real.

El objetivo principal de este proyecto es practicar lo aprendido durante el curso de **MCP for beginers**: `https://github.com/microsoft/mcp-for-beginners`.

## Tecnologías utilizadas

- **Node.js**
- **TypeScript**
- **`@modelcontextprotocol/sdk`** - protocolo MCP y transporte SSE
- **Express** – manejo de rutas HTTP
- **Zod** – validación de parámetros de entrada
- **Fetch API** – llamadas a la API de Chuck Norris

## Instalación y ejecución del proyecto

1.  Clone el repositorio localmente: `git clone -b 0.5-sse-server https://github.com/Juliotamara23/MCPs-Practices.git`
2.  Instale las dependencias: `npm install`
3.  Construir y ejecutar

```bash
npm run build
npm run start
```

También puede ejecutar con el inspector:

```bash
npm inspector
```

El servidor escuchará en el puerto **3001**.\
Para probar el transporte SSE, ve a la carpeta .vscode y dentro a mcp.json:
Dentro del archivo estara la opción para ejecutar el servidor MCP.

## Características 

| Herramienta         | Descripción                                                                 |
|----------------------|-----------------------------------------------------------------------------|
| joke-categories      | Devuelve la lista de categorías disponibles de la API de Chuck Norris.         |
| random-joke          | Devuelve un chiste aleatorio.                                               |
| random-joke-by-category | Devuelve un chiste aleatorio de una categoria en especifico

**Transporte SSE**: Permite a los servidores enviar actualizaciones en tiempo real a los clientes sobre HTTP.\
**Validación con Zod**: garantiza que los parámetros de entrada sean correctos.\
**Manejo de errores**: cada herramienta devuelve mensajes claros en caso de fallo.

## Explicación Técnica

- **Servidor MCP**: Se crea con `new McpServer({ name, version })` y se expone a través de Express.  
- **Transporte SSE**: `SSEServerTransport` se instancia en la ruta `/sse` y se guarda en un mapa `transports`.  
- **Conexión**: `await server.connect(transport)` enlaza el transporte con el servidor MCP.  
- **Herramientas**: Se registran con `server.tool(name, description, schema, handler)`.  
  - El Esquema puede ser un objeto vacío `{}` o una definición Zod (ejemplo: `{ category: z.string() }`).  
  - El Handler es una función asíncrona que devuelve `{ content: [{ type: "text", text }] }`.  
- **Rutas POST**: La ruta `/messages` recibe el `sessionId` del query y delega el procesamiento al transporte con `transport.handlePostMessage(req, res)`.  
- **Compilación**: `tsc` genera los archivos JavaScript en la carpeta `build`.  
- **Inspector**: El archivo `mcp.json` contiene la configuración del inspector de MCP.