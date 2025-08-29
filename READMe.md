# <h1 align='center'> Usando el modo agente de Github Copilot para consumir servidores MCP</h1>

El presente proyecto indica como usar el modo agente de Github copilot para consumir servidores MCP, en este caso especifico se usara el servidor de cálculos básicos.

Este proyecto forma parte de las prácticas realizadas durante el curso de **MCP for beginners**: `https://github.com/microsoft/mcp-for-beginners`.

## Configuración

Para consumir un servidor de MCP que hallamos creado se debe crear una carpeta .vscode en el proyecto para almacenar la información de configuración, dentro de esta carpeta se debe crear el archivo MCP.json:

```
.vscode
|-- mcp.json
```

La cual contendra la configuración para comunicarce con el servidor de calculadora:

```json
{
    "inputs": [],
    "servers": {
        "hello-mcp": {
            "command": "node",
            "args": [
                "E:/DEV/Proyects/MCPs/0.2-calculator-server/build/index.js"
            ]
        }
    }
}

```
Detalles de la configuración

- Nombre del servidor: `` hello-mcp ``
- Runtime: Node.js
- Archivo del servidor: Apunta a un servidor calculadora ubicado en ``0.2-calculator-server/build/index.js``

**Nota**: La ruta para el servidor de MCP debe ser exacta o no se presentara un error.

## Configuración Inicial

1. **Habilitar Descubrimiento de Servidores MCP:**
    * Ir a File -> Preferences -> Settings
    * Buscar "MCP"
    * Habilitar chat.mcp.discovery.enabled

2. **Verificar la Estructura del Proyecto:**

    * Asegurarse de que existe la carpeta .vscode
    * Confirmar que el archivo MCP.json está presente y correctamente configurado

## Uso
Iniciar el Servidor

1. Localizar el archivo MCP.json en la carpeta .vscode
2. Buscar el icono "play" junto a la configuración del servidor
3. Hacer clic en el icono para iniciar el servidor

Usar el Servidor con GitHub Copilot

1. Abrir GitHub Copilot Chat
2. Verificar que el número de herramientas disponibles ha aumentado en el icono de herramientas
3. Se puede interactuar con el servidor mediante prompts naturales
    * Ejemplo: "suma 22 más 1"

Gestión de Herramientas
  * Hacer clic en el icono de herramientas en GitHub Copilot Chat para ver las herramientas disponibles
  * Activar/desactivar herramientas según sea necesario
  * Las herramientas disponibles dependerán de las capacidades del servidor MCP