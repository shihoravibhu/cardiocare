"""Simple backend launcher.

You can now start the backend with only:
    python app.py

No manual venv activation is required.
"""

from pathlib import Path
import os
import sys

BASE_DIR = Path(__file__).resolve().parent

def has_dependencies() -> bool:
    try:
        import fastapi
        import uvicorn
        return True
    except ImportError:
        return False


# If current environment does not have the packages, try switching to venv
if not has_dependencies():
    if sys.prefix == sys.base_prefix:
        if os.name == "nt":
            venv_python = BASE_DIR / "venv" / "Scripts" / "python.exe"
        else:
            venv_python = BASE_DIR / "venv" / "bin" / "python"

        if venv_python.exists():
            import subprocess
            # Use subprocess.call because os.execv on Windows fails on paths containing spaces
            sys.exit(subprocess.call([str(venv_python), str(Path(__file__).resolve()), *sys.argv[1:]]))

        print("\nVirtual environment or required dependencies not found.")
        print("Run these commands once from the backend folder:")
        print("  python -m pip install -r requirements.txt")
        print("Then run: python app.py\n")
        sys.exit(1)

import uvicorn


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8001))
    reload = os.environ.get("RELOAD", "false").lower() in ("true", "1", "yes")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=reload,
    )
