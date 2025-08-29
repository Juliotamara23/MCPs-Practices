# <h1 align="center"> MCPs-Practices </h1>

Este repositorio contiene una colección de prácticas y ejemplos relacionados con el Model Context Protocol (MCP), siguiendo el curso de [MCP for Beginners](https://github.com/microsoft/mcp-for-beginners) de Microsoft.

## Estructura del Repositorio

El repositorio está organizado en diferentes ramas, cada una enfocada en un aspecto específico de MCP:

### 0.1-weather_hour
Implementación de un servicio del clima que proporciona información meteorológica por hora.

### 0.2-calculator
Dividido en dos componentes:
- **calculator-server**: Implementación del servidor MCP para operaciones matemáticas básicas.
- **calculator-client**: Cliente que consume los servicios del servidor de calculadora.

### 0.3-llm-client
Cliente para interactuar con modelos de lenguaje (LLM) a través de MCP.

### 0.4-vscode
Integración con Visual Studio Code y GitHub Copilot Agent mode para consumir servidores MCP.

## Requisitos Previos

- Node.js
- Visual Studio Code
- GitHub Copilot
- Conocimientos básicos de JavaScript/TypeScript
- Familiaridad con conceptos de API y protocolos de comunicación

## Configuración del Proyecto

Cada rama contiene su propia configuración y requisitos específicos. Para comenzar con cualquier ejemplo:

1. Clonar el repositorio:
```bash
git clone https://github.com/Juliotamara23/MCPs-Practices.git
```

2. Cambiar a la rama deseada:

```bash
git checkout <nombre-rama>
```
3. Seguir las instrucciones específicas en el README de cada rama.

### Ejemplos Disponibles

**Servidor de Calculadora**
- Ubicación: rama 0.2-calculator-server
- Implementa operaciones matemáticas básicas
- Proporciona una API MCP para realizar cálculos

**Cliente de Calculadora**
- Ubicación: rama 0.2-calculator-client
- Demuestra cómo consumir servicios MCP
- Incluye ejemplos de operaciones matemáticas

**Servicio del Clima**
- Ubicación: rama 0.1-wheather_hour
- Proporciona información meteorológica
- Ejemplo de integración con servicios externos

**Cliente LLM**
- Ubicación: rama 0.3-llm-client
- Interacción con modelos de lenguaje
- Ejemplo de procesamiento de lenguaje natural

**Integración con VS Code**
- Ubicación: rama 0.4-vscode
- Uso de GitHub Copilot Agent mode
- Configuración de servidores MCP en VS Code

### Recursos Adicionales

- [MCP for Beginners](https://github.com/microsoft/mcp-for-beginners)
- [Documentación oficial de MCP](https://github.com/microsoft/mcp-for-beginners)
- [Documentación de VS Code para MCP](code.visualstudio.com/docs/copilot/chat/mcp-servers)
- [Documentación de Github Copilot](https://docs.github.com/en/copilot)
