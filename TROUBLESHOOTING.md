# Troubleshooting Guide

## Common Issues and Solutions

### ❌ "Cross-origin script load denied" Error

**Problem**: ES6 modules fail to load when opening HTML files directly in browser.

**Solution**: Always use a web server:
```bash
# Start local server
python3 -m http.server 8000

# Then visit: http://localhost:8000
```

**Why**: Modern browsers block ES6 module imports from `file://` URLs due to CORS security policy.

---

### ❌ "Start Game" Button Not Working

**Symptoms**: Clicking "Start Game" does nothing, no error messages.

**Debug Steps**:
1. Open browser Developer Tools (F12)
2. Check Console tab for error messages
3. Look for module loading errors

**Common Causes**:
- ✅ **CORS Error**: Use web server (see above)
- ✅ **Web Audio API**: Some browsers require user interaction first
- ✅ **Missing Elements**: Required DOM elements not found

---

### ❌ No Sound in Game

**Problem**: Game works but no audio plays.

**Solutions**:
1. **Check browser audio policy**: Some browsers require user interaction before allowing audio
2. **Try clicking on the page first** before starting the game
3. **Check browser console** for Web Audio API errors

**Browser Compatibility**:
- ✅ Chrome: Full support
- ✅ Firefox: Full support  
- ⚠️ Safari: May require user interaction for audio
- ⚠️ Mobile browsers: Limited Web Audio API support

---

### ❌ Game Runs Slowly

**Symptoms**: Low FPS, choppy animation.

**Solutions**:
1. **Close other browser tabs** to free memory
2. **Check browser console** for performance warnings
3. **Disable particle effects** (modify CONFIG.js)
4. **Use hardware acceleration** if available

---

### ❌ Mobile Controls Not Working

**Problem**: Touch controls don't respond on mobile devices.

**Debug Steps**:
1. Check if mobile controls are visible
2. Verify touch events in browser console
3. Test on different mobile browsers

---

### ❌ High Scores Not Saving

**Problem**: Scores reset when browser is closed.

**Cause**: LocalStorage may be disabled or full.

**Solutions**:
1. **Check browser privacy settings**
2. **Clear browser storage** if full
3. **Enable localStorage** in browser settings

---

## Debug Tools

### Built-in Debug Features

**Keyboard Shortcuts**:
- `Cmd/Ctrl + L`: Export debug logs
- `Cmd/Ctrl + D`: Show debug information

**Browser Console Access**:
```javascript
// Access game instance
window.game

// Access logger
window.logger

// View recent logs
window.logger.getLogs().slice(-10)

// Export logs for analysis
window.logger.exportLogs()
```

### Debug Test Files

**`debug.html`**: Comprehensive testing interface
- Module loading verification
- DOM element checking
- Game initialization testing

**`simple-game-test.html`**: Simplified version without complex features
- Basic functionality testing
- Isolated error debugging

**`test.html`**: Step-by-step testing
- Manual module loading
- Individual component testing

---

## Performance Monitoring

### Frame Rate Issues

**Check Performance**:
```javascript
// View FPS in console logs
// Look for "FPS:" messages every second

// Check update/render timing
// Look for "PERFORMANCE:" messages
```

**Optimization Tips**:
- Reduce particle count in CONFIG.js
- Lower canvas resolution
- Disable complex visual effects

### Memory Issues

**Monitor Memory Usage**:
1. Open browser DevTools
2. Go to Performance tab
3. Record a session while playing
4. Look for memory leaks

---

## Browser-Specific Issues

### Chrome
- Usually best performance
- Full Web Audio API support
- Good ES6 module support

### Firefox  
- Good overall compatibility
- May have slight performance differences
- Full feature support

### Safari
- May require user interaction for audio
- ES6 modules work with server
- Some performance limitations

### Mobile Browsers
- Touch controls automatically enabled
- Limited Web Audio API support
- Performance varies by device

---

## Getting Help

If issues persist:

1. **Check browser console** for detailed error messages
2. **Export debug logs** using `Cmd/Ctrl + L`
3. **Test with different browsers**
4. **Try the simplified test files**
5. **Ensure you're using a web server**

For additional support, include:
- Browser name and version
- Operating system
- Console error messages
- Steps to reproduce the issue