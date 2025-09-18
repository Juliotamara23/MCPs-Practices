from mcp.client.streamable_http import streamablehttp_client
from mcp import ClientSession
import asyncio
import mcp.types as types
from mcp.shared.session import RequestResponder
import requests
import logging

# 🛠️ Configurando loggin
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger('mcp_client')

class LoggingCollertor:
    def __init__(self):
        self.log_message: list[types.LoggingMessageNotificationParams] = []
    async def __call__(self, params: types.LoggingMessageNotificationParams) -> None:
        self.log_message.append(params)
        logger.info("MCP Log: %s - %s", params.level, params.data)

logging_collector = LoggingCollertor()
port = 8000

# 🛠️ Handler para los mensajes
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

# 🚀 Iniciando el servidor MCP
async def main ():
    logger.info("🚀 iniciando cliente...")
    async with streamablehttp_client(f"http://localhost:{port}/mcp") as (
        read_stream,
        write_stream,
        session_callback,
    ):
        async with ClientSession(
            read_stream,
            write_stream,
            logging_callback=logging_collector,
            message_handler=message_handler,
        ) as session:
            id_before = session_callback(),
            logger.info("ID session antes de la inicialización: %s", id_before)
            await session.initialize()
            id_after = session_callback()
            logger.info("ID session despues de la inicialización: %s", id_after)
            logger.info("Session iniciada: listo para listar la herramienta")
            tool_result = await session.call_tool("process_files", {"message:" "Hola por parte del cliente"})
            logger.info("Resultado: %s", tool_result)
            if logging_collector.log_message:
                logger.info("Recopilando mensajes de logs")
                for log in logging_collector.log_message:
                    logger.info("log: %s", log)

if __name__ == "__main__":
    import sys

    if len(sys.argv) > 1 and sys.argv[1] == "mcp":
        # Cliente de MCP
        logger.info("🚀 Cliente HTTP streamable ejecutandose...")
        asyncio.run(main())
    else:
        # Cliente HTTP clasico