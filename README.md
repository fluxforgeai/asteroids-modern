# Asteroids - Modern Edition

A modern HTML5 Canvas implementation of the classic Asteroids arcade game, featuring enhanced graphics, sound effects, particle systems, and mobile support.

![Asteroids Game](https://img.shields.io/badge/Game-Asteroids-blue.svg)
![HTML5](https://img.shields.io/badge/HTML5-Canvas-orange.svg)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow.svg)
![Mobile](https://img.shields.io/badge/Mobile-Friendly-green.svg)

## 🎮 Features

### Core Gameplay
- **Classic Asteroids mechanics** with modern enhancements
- **Progressive difficulty** - more asteroids each level
- **Lives system** with extra lives every 10,000 points
- **High score tracking** with local storage persistence
- **Pause functionality** (P key)
- **Game state management** (menu, playing, paused, game over)

### Enhanced Features
- **Asteroid splitting** - large asteroids break into medium, medium into small
- **UFO enemies** with AI targeting and different sizes
- **Power-ups system**:
  - 🛡️ **Shield** - Absorb 3 hits
  - 🔥 **Rapid Fire** - Increased firing rate
  - 🎯 **Multi-Shot** - Fire 3 bullets at once
- **Hyperspace jump** - Emergency teleportation (H key)
- **Invulnerability period** after respawn with blinking effect

### Visual & Audio
- **Particle effects** for explosions, thrust, and power-up collection
- **Dynamic sound system** using Web Audio API
- **Procedural audio** - no external sound files needed
- **Smooth animations** at 60 FPS
- **Glowing UI effects** with CSS animations
- **Responsive design** that scales to fit any screen

### Mobile Support
- **Touch controls** for mobile devices
- **Virtual gamepad** with on-screen buttons
- **Responsive layout** optimized for both desktop and mobile

## 🎯 Controls

### Desktop
- **Arrow Keys**: Rotate ship (←/→) and thrust (↑)
- **Spacebar**: Fire bullets
- **H**: Hyperspace jump
- **P**: Pause game

### Mobile
- **On-screen buttons** for all controls
- **Touch-friendly interface**

## 🚀 Getting Started

### Prerequisites
- Modern web browser with HTML5 Canvas support
- Local web server (for development) or any web hosting service

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/fluxforgeai/asteroids-modern.git
   cd asteroids-modern
   ```

2. **Start the web server** (Required for ES6 modules)
   
   **Option A: Use the included script**
   ```bash
   ./start-server.sh
   ```
   
   **Option B: Python HTTP Server**
   ```bash
   python3 -m http.server 8000
   ```
   
   **Option C: Node.js http-server**
   ```bash
   npx http-server
   ```
   
   **⚠️ Important**: Do NOT open `index.html` directly in the browser - ES6 modules require a web server due to CORS policy.

3. **Open in browser**
   ```
   http://localhost:8000
   ```
   
   Then click on `index.html` to start the game.

## 🏗️ Project Structure

```
asteroids/
├── index.html              # Main HTML file
├── styles.css              # Game styling and responsive design
├── README.md               # This file
└── js/
    ├── main.js             # Game initialization and main loop
    ├── Game.js             # Core game logic and state management
    ├── config.js           # Game configuration and constants
    ├── utils.js            # Utility functions and classes
    ├── entities/           # Game entity classes
    │   ├── Entity.js       # Base entity class
    │   ├── Ship.js         # Player ship
    │   ├── Asteroid.js     # Asteroid objects
    │   ├── Bullet.js       # Projectiles
    │   ├── UFO.js          # Enemy UFOs
    │   └── PowerUp.js      # Power-up items
    ├── effects/            # Visual effects
    │   ├── Particle.js     # Individual particle
    │   └── ParticleSystem.js # Particle management
    └── systems/            # Game systems
        ├── SoundSystem.js  # Audio management
        └── InputHandler.js # Input processing
```

## 🎨 Game Objects

### Ship
- **Movement**: Realistic physics with thrust and friction
- **Weapons**: Projectile-based firing system
- **Special abilities**: Hyperspace jump, power-up compatibility
- **Protection**: Invulnerability period and shield power-up

### Asteroids
- **Three sizes**: Large, Medium, Small
- **Splitting mechanics**: Break into 2-3 smaller pieces
- **Procedural shapes**: Randomly generated irregular polygons
- **Physics**: Realistic movement and rotation

### UFOs
- **Two types**: Large (less accurate) and Small (highly accurate)
- **AI behavior**: Seeks player and fires periodically
- **Movement patterns**: Horizontal traversal with vertical adjustments

### Power-ups
- **Shield**: Absorbs damage from asteroids and UFO bullets
- **Rapid Fire**: Increases firing rate significantly
- **Multi-Shot**: Fires three bullets simultaneously

## ⚡ Performance Features

### Optimization Techniques
- **Object Pooling**: Reuses bullet and particle objects
- **QuadTree Spatial Partitioning**: Efficient collision detection
- **Frame Rate Management**: Consistent 60 FPS with delta timing
- **Memory Management**: Proper cleanup of game objects

### Browser Compatibility
- **Modern ES6**: Uses ES6 modules and classes
- **Web Audio API**: For dynamic sound generation
- **Canvas 2D**: Hardware-accelerated rendering
- **Local Storage**: For persistent high scores

## 🔧 Configuration

Game settings can be modified in `js/config.js`:

```javascript
export const CONFIG = {
    CANVAS: { WIDTH: 800, HEIGHT: 600 },
    SHIP: { SIZE: 15, THRUST: 300, TURN_SPEED: 360 },
    ASTEROIDS: { INITIAL_COUNT: 4, SPEED: { MIN: 20, MAX: 80 } },
    // ... more settings
};
```

## 🎵 Audio System

The game features a complete procedural audio system:
- **Laser sounds**: Synthesized projectile firing
- **Explosions**: Dynamic noise-based explosions
- **Thrust**: Filtered noise for engine sounds
- **UFO sounds**: Oscillating tones for enemy presence
- **Power-ups**: Musical chimes for item collection

## 📱 Mobile Optimization

- **Responsive Canvas**: Automatically scales to fit screen
- **Touch Controls**: Virtual buttons for all game actions
- **Performance**: Optimized for mobile processors
- **Battery Friendly**: Efficient rendering and updates

## 🏆 Scoring System

- **Asteroids**: 20 (Large), 50 (Medium), 100 (Small) points
- **UFOs**: 200 (Large), 1000 (Small) points
- **Extra Lives**: Awarded every 10,000 points
- **High Scores**: Top 5 scores saved locally

## 🛠️ Development

### Code Architecture
- **Modular Design**: ES6 modules for clean separation
- **Object-Oriented**: Entity-based game object system
- **Event-Driven**: Input handling and game state management
- **Extensible**: Easy to add new features and game objects

### Adding New Features

1. **New Entity Types**: Extend the `Entity` base class
2. **New Power-ups**: Add to `PowerUp` class and update config
3. **New Sounds**: Extend `SoundSystem` with new generators
4. **New Effects**: Add particle types to `ParticleSystem`

## 🎮 Future Enhancements

Potential improvements and additions:
- **Multiplayer support**
- **Boss enemies**
- **More power-up types**
- **Level progression with different environments**
- **WebGL renderer for advanced effects**
- **Online leaderboards**
- **Achievement system**
- **Customizable controls**

## 🐛 Known Issues

- **Audio Context**: May require user interaction to start on some browsers
- **Mobile Performance**: Complex particle effects may impact older devices
- **Touch Precision**: Fine movement control on touch devices

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Original Asteroids game by Atari (1979)
- Modern web technologies and HTML5 Canvas
- Web Audio API for procedural sound generation
- ES6 modules for clean code architecture

---

**Built with ❤️ using HTML5 Canvas and modern JavaScript**