#!/bin/bash

echo "📱 Starting Asteroids Game Server for Mobile Testing..."
echo ""

# Get local IP address
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -1 | awk '{print $2}')

echo "🌐 Server will be available at:"
echo "  • Local: http://localhost:8000"
echo "  • Network: http://$LOCAL_IP:8000"
echo ""
echo "📱 On your mobile device (same WiFi):"
echo "  • Open browser and go to: http://$LOCAL_IP:8000"
echo "  • Click on index.html"
echo ""
echo "🎮 Mobile features:"
echo "  • Touch controls automatically enabled"
echo "  • Responsive design"
echo "  • Virtual gamepad buttons"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start server accessible from network
python3 -m http.server 8000 --bind 0.0.0.0