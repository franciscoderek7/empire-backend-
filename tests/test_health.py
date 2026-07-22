from src.utils.health import health

result=health()

assert result["status"]=="healthy"

print("Health test passed")
