import platform
import sys

def check():
    return {
        "platform": platform.system(),
        "python": sys.version,
        "status": "online"
    }

if __name__ == "__main__":
    print(check())
