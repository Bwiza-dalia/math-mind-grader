#!/bin/bash
set -e

echo "=========================================="
echo "Starting EasyGrade API..."
echo "=========================================="
echo "PORT: ${PORT:-8000}"
echo "Python version: $(python --version)"
echo "Working directory: $(pwd)"
echo "Files in /app: $(ls -la | head -10)"

# Check if required files exist
if [ ! -f "api.py" ]; then
    echo "ERROR: api.py not found!"
    exit 1
fi

# Test Python import
echo "Testing Python imports..."
python -c "import fastapi; import uvicorn; print('✓ FastAPI and Uvicorn imported successfully')" || {
    echo "ERROR: Failed to import required modules"
    exit 1
}

echo "Starting uvicorn server..."
exec uvicorn api:app --host 0.0.0.0 --port ${PORT:-8000} --log-level info

