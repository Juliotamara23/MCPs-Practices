from fastapi import FastAPI
from fastapi.responses import StreamingResponse, HTMLResponse
from mcp.server.fastmcp import FastMCP, Context
from mcp.types import TextContent
import asyncio
import os
import uvicorn

# 🛠️ Instanciando el servidor MCP
mcp = FastMCP("MCP Server HTTP Streamable")
app = FastAPI()

'''
    📢 Endpoint de prueba.
    Verificar que el servidor esté funcionando.
'''

@app.get("/", response_class=HTMLResponse)
async def root():
    html_path = os.path.join(os.path.dirname(__file__), "index.html")
    with open(html_path, "r", encoding="utf-8") as f:
        html_content = f.read()
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


# 🛠️ Configurar el handler para la herramienta `process_files`
@mcp.tool(description="Simula el procesamiento de archivos y envía notificaciones de progreso.")
async def process_files(message: str, ctx: Context) -> TextContent:
    files = [f"file_{i}.txt" for i in range(1, 4)]
    for idx, file in enumerate(files, 1):
        await ctx.info(f"Procesando {file} ({idx}/{len(files)})...")
        await asyncio.sleep(1)  
    await ctx.info("Archivos procesados")
    return TextContent(type="text", text=f"Processed files: {', '.join(files)} | Message: {message}")
 
# 🚀 Iniciando el servidor MCP
if __name__ == "__main__":
    import sys
    if "mcp" in sys.argv:

        # Inicia el servidor usando http streamable como mecanismo de transporte
        print("🚀 Iniciando el servidor con http streamable...")
        mcp.run(transport="streamable-http")
    else:
        # Inicia el servidor usando classic http streaming
        print("🚀 Iniciando el servidor con classic http streaming...")
        uvicorn.run("server:app", host="127.0.0.1", port=8000, reload=True)