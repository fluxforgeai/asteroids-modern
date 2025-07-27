#!/bin/bash

echo "🚀 Starting Asteroids Game Server..."
echo ""
echo "The game will be available at:"
echo "  http://localhost:8000"
echo ""
echo "Files available:"
echo "  • index.html - Main game"
echo "  • simple-game-test.html - Simplified test version"
echo "  • debug.html - Debug panel"
echo "  • test.html - Step-by-step testing"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Try different Python versions
if command -v python3 &> /dev/null; then
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    python -m http.server 8000
else
    echo "❌ Python not found. Please install Python or use another web server."
    echo ""
    echo "Alternative methods:"
    echo "  • Node.js: npx http-server"
    echo "  • PHP: php -S localhost:8000"
    echo "  • Or use any other web server"
fi