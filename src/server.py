from fastapi import FastAPI
from fastapi.responses import StreamingResponse, HTMLResponse
from mcp.server.fastmcp import FastMCP, Context
from mcp.types import TextContent
import asyncio
import os
import uvicorn

# 🛠️ Instanciando el servidor MCP
mcp = FastMCP(
    {
        "name": "http-streamable-axample",
        "version": "1.0.0"
    }
)
app = FastAPI()

'''
    📢 Endpoint de prueba.
    Verificar que el servidor esté funcionando.
'''

@app.get("/", response_class=HTMLResponse)
async def root():
    html_path = os.path.join(os.path.dirname(__file__), "index.html")
    with open(html_path, "r") as file:
        html_content = file.read()
    return HTMLResponse(html_content)

'''
    📢 Endpoint para classic HTTP streaming
    Simula el procesamiento de archivos y envía notificaciones de progreso.
'''

async def event_stream(message: str):
    for i in range(1, 4):
        yield f"Progreso de archivo: {i} de 3\n"
        await asyncio.sleep(1)
    yield f"Archivo procesado: {message}\n"

@app.get("/stream")
async def stream_file(message: str = "Hola"):
    return StreamingResponse(event_stream(message), media_type="text/plain")

# 🚀 Iniciando el servidor MCP
if __name__ == "__main__":
    uvicorn.run("server:app", host="127.0.0.1", port=8000)