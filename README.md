# <h1 align="center"> Servidor de Clima y Hora MCP </h1>

## Descripción

Este proyecto implementa un servidor Model Context Protocol (MCP) que proporciona dos funcionalidades principales: obtener información climática para cualquier ciudad y obtener la hora actual para ubicaciones específicas del mundo. Se construyó como una demostración de cómo crear y exponer herramientas a través de un servidor MCP.

Basado en el curso **MCP for Beginners**: https://github.com/microsoft/mcp-for-beginners.

## Tecnologías Utilizadas

- TypeScript.
- SDK Model Context Protocol (@modelcontextprotocol/sdk).
- Node.js.
- APIs externas:
  - API de Clima **Open-Meteo**.
  - API de Hora Mundial **World Time API**.

## Instalación y Ejecución

### Requisitos Previos

- Node.js instalado.
- Gestor de paquetes npm.

### Pasos de Instalación

1. Clonar la repositorio

```bash
git clone git clone -b 0.1-wheather_hour
```

2. Instalar dependencias

```bash
npm install
```

3. Ejecutar el proyecto

```bash
npm start
```

## Características

El servidor proporciona dos herramientas principales:

### 1. Herramienta de Información Climática

- Nombre de la herramienta: "obtener el clima".
- Obtiene datos climáticos para cualquier ciudad.
- Proporciona temperatura actual, precipitación y pronóstico diario.
- Utiliza la API Open-Meteo para obtener datos precisos.

### 2. Herramienta de Hora Actual

- Nombre de la herramienta: "obtener la hora actual".
- Obtiene la hora actual para cualquier ubicación del mundo.
- Requiere parámetros de área (continente) y ubicación (ciudad).
- Utiliza la API Mundial de Hora.

## Explicación Técnica

### Estructura del Proyecto

El proyecto se construyó utilizando TypeScript y el SDK MCP. Las componentes principales son:

### Configuración del Servidor

```typescript
const server = new McpServer({
  nombre: "servidor-demo",
  versión: "1.0.0",
});
```

### Implementación de Herramientas

1. **Herramienta de Clima**

   - Utiliza geocodificación para encontrar las coordenadas de la ciudad.
   - Obtiene datos climáticos utilizando las coordenadas latitud y longitud.
   - Devuelve información formatada sobre el clima.

2. **Herramienta de Hora Actual**
   - Acepta parámetros de área (continente) y ubicación (ciudad).
   - Realiza llamadas a la API Mundial de Hora.
   - Maneja errores y solicitudes inválidas.

### Comunicación

- Utiliza StdioServerTransport para comunicación cliente-servidor.
- Implementa patrones async/await para llamadas a APIs.
- Incluye manejo de errores para ambas herramientas.

### Validación de Datos

- Utiliza Zod esquema de validación para parámetros de entrada.
- Garantiza seguridad de tipo en todo el aplicativo.
- Proporciona mensajes de error claros para entradas.