import os
import sys

# Ensure project root and backend are in python path
root_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.join(root_dir, "backend")

for d in (root_dir, backend_dir):
    if d not in sys.path:
        sys.path.insert(0, d)

# Import the FastAPI app from backend.main
import backend.main as backend_module
app = backend_module.app

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8001))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
