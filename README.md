# <h1 align="center">Servidor y Cliente MCP Streamable HTTP</h1>

## Descripción
Este proyecto implementa dos tipos de servidores HTTP con capacidades de streaming en Python:

1. **HTTP Streamable:** Utiliza MCP (Model Control Protocol) para permitir comunicación bidireccional con notificaciones en tiempo real.
2. **HTTP Streaming Clásico:** Implementa streaming de datos simple utilizando respuestas HTTP estándar.

El proyecto incluye tanto el servidor como el cliente para ambos tipos de streaming, permitiendo procesar archivos de forma asíncrona con notificaciones de progreso.

El objetivo principal de este proyecto es practicar lo aprendido durante el curso de [MCP for Beginners](https://github.com/microsoft/mcp-for-beginners) de Microsoft.

## Tecnologías utilizadas

- **Python 3.9 o superior**
- **FastAPI** - Framework web moderno para construir APIs con Python
- **`@modelcontextprotocol/sdk`** - protocolo MCP y transporte Streamable HTTP
- **Uvicorn** - Servidor ASGI de alto rendimiento
- **Asyncio** - Para programación asíncrona
- **Logging** - Para registro de eventos y depuración

## Instalación y ejecución del proyecto

1.  Clone el repositorio localmente:
`git clone -b 0.6-http-streaming-python https://github.com/Juliotamara23/MCPs-Practices.git`
2.  Crea y activa un entorno virtual (recomendado):
```bash
python -m venv venv
.\venv\Scripts\Activate.ps1  # On Windows
# o
source venv/bin/activate      # On Linux/macOS
``` 
3.  Instale las dependencias: `pip install -r requirements.txt`
4.  Ejecución:

    1 . Servidor:

    Para iniciar el servidor con MCP (HTTP Streamable):

        python src/server.py mcp

    Para iniciar el servidor con HTTP Streaming clásico:

        python src/server.py

    2 . Cliente:
        
    Para ejecutar el cliente MCP (HTTP Streamable):

        python src/client.py mcp

    Para ejecutar el cliente de HTTP Streaming clásico:

        python src/client.py

## Características

### Servidor
- Endpoints
  - GET /: Endpoint principal de Streamable HTTP.
  - GET /stream: Endpoint de streaming clásico.
- Tool: handler de herramienta `process_files` de MCP.

### Cliente
- Soporte para ambos tipos de streaming.
- Sistema de logging integrado.
- Manejo de sesiones asíncronas.
- Notificaciones en tiempo real.

## Explicación Técnica

### Streamable HTTP(MCP)

- **Bidireccional:** Permite comunicación en ambos sentidos entre cliente y servidor.
- **Notificaciones push:** El servidor puede enviar notificaciones al cliente sin necesidad de polling.
- **Sesiones persistentes:** Mantiene el contexto de la sesión durante la conexión.

Implementación en ``server.py``:

``` python
@mcp.tool(description="Simula el procesamiento de archivos y envía notificaciones de progreso.")
async def process_files(message: str, ctx: Context) -> TextContent:
    files = [f"file_{i}.txt" for i in range(1, 4)]
    for idx, file in enumerate(files, 1):
        await ctx.info(f"Procesando {file} ({idx}/{len(files)})...")
        await asyncio.sleep(1)  
    await ctx.info("Archivos procesados")
    return TextContent(type="text", text=f"Processed files: {', '.join(files)} | Message: {message}")
```

**Ventajas**:
- Notificaciones en tiempo real con ctx.info().
- Manejo estructurado de respuestas con TextContent.
- Soporte para múltiples herramientas y funcionalidades.

### HTTP Streaming clasico

- Unidireccional: Flujo de datos del servidor al cliente.
- Simple implementación: Usa respuestas HTTP estándar.
- Sin estado: Cada solicitud es independiente.

Implementación en ``server.py``:

```python
async def event_stream(message: str):
    for i in range(1, 4):
        yield f"Progreso de archivo: {i} de 3\n"
        await asyncio.sleep(1)
    yield f"Archivo procesado: {message}\n"

@app.get("/stream")
async def stream_file(message: str = "Hola"):
    return StreamingResponse(event_stream(message), media_type="text/plain")
```

**Ventajas**
- Implementación sencilla con generadores de Python.
- Bajo overhead de protocolo.
- Compatible con cualquier cliente HTTP.

El cliente implementa un manejador de mensajes para procesar y mostrar las notificaciones a medida que llegan.

Implementación en ``cliente.py``:

```python
async def message_handler(
    message: RequestResponder[types.ServerRequest, types.ClientResult]
    | types.ServerNotification
    | Exception,
) -> None:
    logger.info("Received message: %s", message)
    if isinstance(message, Exception):
        logger.error("Exception received!")
        raise message
    elif isinstance(message, types.ServerNotification):
        logger.info("NOTIFICATION: %s", message)
    elif isinstance(message, RequestResponder):
        logger.info("REQUEST_RESPONDER: %s", message)
    else:
        logger.info("SERVER_MESSAGE: %s", message)
```

En el código anterior, la función message_handler verifica si el mensaje entrante es una notificación. Si lo es, imprime la notificación; de lo contrario, lo procesa como un mensaje regular del servidor.