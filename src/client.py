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