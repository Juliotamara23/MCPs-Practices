"""
Implementación de servidor de calculadora MCP de muestra en Python.
"""

from mcp.server.fastmcp import FastMCP
import numpy as np

server = FastMCP("calculator")

@server.tool()
def add(a: float, b: float) -> float:
    """Suma dos números y devuelve el resultado."""
    return a + b

@server.tool()
def subtract(a: float, b: float) -> float:
    """Resta dos números y devuelve el resultado."""
    return a - b

@server.tool()
def multiply(a: float, b: float) -> float:
    """Multiplicar dos números y devuelve el resultado."""
    return a * b

@server.tool()
def divide(a: float, b: float) -> float:
    """
    Divide dos números y devuelve el resultado.
    
    Raises:
        ValueError: Si b es cero
    """
    if b == 0:
        raise ValueError("No se puede dividir entre cero")
    
    return a / b

@server.tool()
def log(a: float) -> float:
    """Calcula el logaritmo natural de un número y devuelve el resultado."""
    return np.log(a)