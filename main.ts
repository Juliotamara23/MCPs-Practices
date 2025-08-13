import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// crear el servidor
const server = new McpServer({
  name: "demo-server",
  version: "1.0.0",
});

// Definiendo las herramientas
server.tool(
  "fetch the weather",
  "Tool to fetch the weather of a city",
  {
    city: z.string().describe("City name"),
  },
  async ({ city }) => {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=10&language=en&format=json`
    );
    const data = await response.json();

    if (data.results.length === 0) {
      return {
        content: [
          {
            type: "text",
            text: `No se encontró ninguna ciudad con el nombre ${city}`,
          },
        ],
      };
    }

    const { latitude, longitude } = data.results[0];
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&current=temperature_2m,is_day,rain,precipitation&forecast_days=1`
    );
    const weatherData = await weatherResponse.json();

    return Promise.resolve({
      content: [
        {
          type: "text",
          text: JSON.stringify(weatherData, null, 2),
        },
      ],
    });
  }
);

server.tool(
  "fetch the current time",
  "Tool to fetch the current time for a specific area and location.",
  {
    area: z.string().describe("The continent or area, e.g., 'America'"),
    location: z.string().describe("The city or location, e.g., 'Bogota'"),
  },
  async ({ area, location }) => {
    try {
      const url = `http://worldtimeapi.org/api/timezone/${area}/${location}`;
      const response = await fetch(url);
      const data = await response.json();

      if (response.status !== 200) {
        return {
          content: [
            {
              type: "text",
              text: `Error al obtener la hora: ${
                data.error || "Zona horaria no encontrada."
              }`,
            },
          ],
        };
      }

      return {
        content: [
          {
            type: "text",
            text: `La hora actual en ${area}/${location} es: ${data.datetime}`,
          },
        ],
      };
    } catch (error) {
      console.error("Error fetching time:", error);
      return {
        content: [
          {
            type: "text",
            text: "Ocurrió un error al intentar obtener la hora. Por favor, verifica los parámetros.",
          },
        ],
      };
    }
  }
);

// Escuchar las peticiones del cliente
const transport = new StdioServerTransport();
await server.connect(transport);
