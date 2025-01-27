const CELL_SIZE = 20;
const GRID_WIDTH = 28;
const GRID_HEIGHT = 31;
const DEATH_ANIMATION_DURATION = 1500; // 1.5 seconds

class SoundEngine {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.connect(this.ctx.destination);
        this.masterGain.gain.value = 0.5;
        this.muted = false;
        
        // Start background music
        this.startBackgroundMusic();
    }

    setVolume(value) {
        this.masterGain.gain.value = Math.max(0, Math.min(1, value));
    }

    toggleMute() {
        this.muted = !this.muted;
        this.masterGain.gain.value = this.muted ? 0 : 0.5;
    }

    playChompSound() {
        if (this.muted) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    }

    playDeathSound() {
        if (this.muted) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(400, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 1);
        
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 1);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 1);
    }

    playGhostSound() {
        if (this.muted) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.2);
        
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
    }

    startBackgroundMusic() {
        if (this.muted) return;
        const playNote = (freq, time, duration) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, time);
            
            gain.gain.setValueAtTime(0.1, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + duration - 0.05);
            
            osc.connect(gain);
            gain.connect(this.masterGain);
            
            osc.start(time);
            osc.stop(time + duration);
        };

        // 8-bit metal riff
        const notes = [146.83, 196.00, 220.00, 293.66]; // D3, G3, A3, D4
        const duration = 0.2;
        let time = this.ctx.currentTime;

        // Play the sequence repeatedly
        const playSequence = () => {
            notes.forEach((freq, i) => {
                playNote(freq, time + i * duration, duration);
                playNote(freq * 2, time + i * duration, duration); // Harmony
            });
            time += notes.length * duration;

            // Schedule next sequence
            if (time < this.ctx.currentTime + 2) {
                setTimeout(playSequence, (time - this.ctx.currentTime) * 1000);
            }
        };

        playSequence();
    }

    playGameOverSound() {
        if (this.muted) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 2);
        
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 2);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 2);
    }
}

// Replace SOUNDS constant with SoundEngine instance
const soundEngine = new SoundEngine();

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.keysPressed = new Set();
        this.animationFrame = 0;
        this.lives = 3;
        this.isGamePaused = false;
        this.deathAnimationTimer = null;
        
        this.canvas.width = CELL_SIZE * GRID_WIDTH;
        this.canvas.height = CELL_SIZE * GRID_HEIGHT;
        
        this.maze = this.createMaze();
        this.pellets = [];
        this.ghosts = [];
        this.pacman = new Pacman(this);
        
        this.setupInput();
        this.setupGame();
    }

    createMaze() {
        return [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,2,2,2,2,2,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,2,2,2,2,2,0],
            [0,2,0,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,2,0],
            [0,2,0,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,2,0],
            [0,2,0,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,2,0],
            [0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
            [0,2,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,2,0],
            [0,2,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,2,0],
            [0,2,2,2,2,2,2,0,0,2,2,2,2,0,0,2,2,2,2,0,0,2,2,2,2,2,2,0],
            [0,0,0,0,0,0,2,0,0,0,0,0,1,0,0,1,0,0,0,0,0,2,0,0,0,0,0,0],
            [0,0,0,0,0,0,2,0,0,0,0,0,1,0,0,1,0,0,0,0,0,2,0,0,0,0,0,0],
            [0,0,0,0,0,0,2,0,0,1,1,1,1,1,1,1,1,1,1,0,0,2,0,0,0,0,0,0],
            [0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0],
            [0,0,0,0,0,0,2,0,0,1,0,1,1,1,1,1,1,0,1,0,0,2,0,0,0,0,0,0],
            [1,1,1,1,1,1,2,1,1,1,0,1,1,1,1,1,1,0,1,1,1,2,1,1,1,1,1,1],
            [0,0,0,0,0,0,2,0,0,1,0,1,1,1,1,1,1,0,1,0,0,2,0,0,0,0,0,0],
            [0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0],
            [0,0,0,0,0,0,2,0,0,1,1,1,1,1,1,1,1,1,1,0,0,2,0,0,0,0,0,0],
            [0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0],
            [0,2,2,2,2,2,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,2,2,2,2,2,0],
            [0,2,0,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,2,0],
            [0,2,0,0,0,0,2,0,0,0,0,0,2,0,0,2,0,0,0,0,0,2,0,0,0,0,2,0],
            [0,2,2,2,0,0,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,0,0,2,2,2,0],
            [0,0,0,2,0,0,2,0,0,2,0,0,0,0,0,0,0,0,2,0,0,2,0,0,2,0,0,0],
            [0,0,0,2,0,0,2,0,0,2,0,0,0,0,0,0,0,0,2,0,0,2,0,0,2,0,0,0],
            [0,2,2,2,2,2,2,0,0,2,2,2,2,0,0,2,2,2,2,0,0,2,2,2,2,2,2,0],
            [0,2,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,0,0,2,0],
            [0,2,0,0,0,0,0,0,0,0,0,0,2,0,0,2,0,0,0,0,0,0,0,0,0,0,2,0],
            [0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ];
    }

    setupInput() {
        window.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'w':
                case 'ArrowUp': this.keysPressed.add('up'); break;
                case 's':
                case 'ArrowDown': this.keysPressed.add('down'); break;
                case 'a':
                case 'ArrowLeft': this.keysPressed.add('left'); break;
                case 'd':
                case 'ArrowRight': this.keysPressed.add('right'); break;
            }
        });

        window.addEventListener('keyup', (e) => {
            switch(e.key) {
                case 'w':
                case 'ArrowUp': this.keysPressed.delete('up'); break;
                case 's':
                case 'ArrowDown': this.keysPressed.delete('down'); break;
                case 'a':
                case 'ArrowLeft': this.keysPressed.delete('left'); break;
                case 'd':
                case 'ArrowRight': this.keysPressed.delete('right'); break;
            }
        });
    }

    setupGame() {
        this.createPellets();
        this.createGhosts();
        this.gameLoop();
    }

    gameLoop() {
        this.update();
        this.draw();
        this.animationFrame = requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        if (!this.isGamePaused) {
            this.pacman.update(this.keysPressed);
            this.ghosts.forEach(ghost => ghost.update());
        }
        this.checkCollisions();
    }

    draw() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawMaze();
        this.pellets.forEach(pellet => pellet.draw(this.ctx));
        this.pacman.draw(this.ctx);
        this.ghosts.forEach(ghost => ghost.draw(this.ctx));
        
        document.getElementById('score').textContent = `Score: ${this.score}`;
        
        // Draw lives
        this.drawLives();
    }

    drawLives() {
        const livesText = `Lives: ${this.lives}`;
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'right';
        this.ctx.fillText(livesText, this.canvas.width - 10, 30);
    }

    createPellets() {
        for(let y = 0; y < this.maze.length; y++) {
            for(let x = 0; x < this.maze[y].length; x++) {
                if(this.maze[y][x] === 2) {
                    this.pellets.push(new Pellet(
                        x * CELL_SIZE + CELL_SIZE/2,
                        y * CELL_SIZE + CELL_SIZE/2
                    ));
                }
            }
        }
    }

    createGhosts() {
        const colors = ['red', 'pink', 'cyan', 'orange'];
        colors.forEach((color, i) => {
            this.ghosts.push(new Ghost(
                this,  // Pass game instance
                13 * CELL_SIZE + (i % 2) * CELL_SIZE,
                11 * CELL_SIZE + Math.floor(i / 2) * CELL_SIZE,
                color
            ));
        });
    }

    checkCollisions() {
        // Check pellets
        this.pellets = this.pellets.filter(pellet => {
            const dx = this.pacman.x - pellet.x;
            const dy = this.pacman.y - pellet.y;
            if (Math.hypot(dx, dy) < CELL_SIZE/3) {  // Made collision more precise
                this.score += 10;
                soundEngine.playChompSound();
                return false;
            }
            return true;
        });

        // Check ghosts
        if (!this.isGamePaused && !this.pacman.isDying) {
            for (const ghost of this.ghosts) {
                const dx = this.pacman.x - ghost.x;
                const dy = this.pacman.y - ghost.y;
                if (Math.hypot(dx, dy) < CELL_SIZE * 0.8) {  // Slightly reduced collision radius
                    this.handlePacmanDeath();
                    break;
                }
            }
        }
    }

    handlePacmanDeath() {
        this.isGamePaused = true;
        this.pacman.startDeathAnimation();
        soundEngine.playDeathSound();
        
        clearTimeout(this.deathAnimationTimer);
        this.deathAnimationTimer = setTimeout(() => {
            this.lives--;
            if (this.lives > 0) {
                this.resetLevel();
            } else {
                this.gameOver();
            }
        }, DEATH_ANIMATION_DURATION);
    }

    resetLevel() {
        this.isGamePaused = false;
        this.pacman.reset();
        
        // Reset ghost positions
        this.ghosts.forEach((ghost, i) => {
            ghost.gridX = 13 + (i % 2);
            ghost.gridY = 11 + Math.floor(i / 2);
            ghost.x = ghost.gridX * CELL_SIZE + CELL_SIZE/2;
            ghost.y = ghost.gridY * CELL_SIZE + CELL_SIZE/2;
            ghost.isMoving = false;
            ghost.moveProgress = 0;
        });
    }

    gameOver() {
        cancelAnimationFrame(this.animationFrame);
        soundEngine.playGameOverSound();
        setTimeout(() => {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = 'red';
            this.ctx.font = '48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('GAME OVER', this.canvas.width/2, this.canvas.height/2);
        }, DEATH_ANIMATION_DURATION);
    }

    drawMaze() {
        this.ctx.fillStyle = 'blue';
        for(let y = 0; y < this.maze.length; y++) {
            for(let x = 0; x < this.maze[y].length; x++) {
                if(this.maze[y][x] === 0) {
                    this.ctx.fillRect(
                        x * CELL_SIZE,
                        y * CELL_SIZE,
                        CELL_SIZE,
                        CELL_SIZE
                    );
                }
            }
        }
    }
}

class Pacman {
    constructor(game) {
        this.game = game;
        // Start in a safe position (middle of a path)
        this.gridX = 14;
        this.gridY = 17; // Adjusted to start in a clear path
        this.x = this.gridX * CELL_SIZE + CELL_SIZE/2;
        this.y = this.gridY * CELL_SIZE + CELL_SIZE/2;
        this.direction = null;
        this.nextDirection = null;
        this.isMoving = false;
        this.moveProgress = 0;
        this.speed = 0.1;
        this.isDying = false;
        this.deathProgress = 0;
    }

    reset() {
        this.gridX = 14;
        this.gridY = 17;
        this.x = this.gridX * CELL_SIZE + CELL_SIZE/2;
        this.y = this.gridY * CELL_SIZE + CELL_SIZE/2;
        this.direction = null;
        this.nextDirection = null;
        this.isMoving = false;
        this.moveProgress = 0;
        this.isDying = false;
        this.deathProgress = 0;
    }

    startDeathAnimation() {
        this.isDying = true;
        this.deathProgress = 0;
    }

    update(keysPressed) {
        // Clear next direction if no keys are pressed
        this.nextDirection = null;
        if (keysPressed.has('left')) this.nextDirection = 'left';
        if (keysPressed.has('right')) this.nextDirection = 'right';
        if (keysPressed.has('up')) this.nextDirection = 'up';
        if (keysPressed.has('down')) this.nextDirection = 'down';

        // If we're moving, update position
        if (this.isMoving) {
            this.moveProgress += this.speed;
            
            if (this.moveProgress >= 1) {
                // Snap to grid when completing movement
                this.moveProgress = 0;
                this.isMoving = false;
                
                // Update grid position
                const [newX, newY] = this.getNextPosition(this.direction);
                if (this.canMove(newX, newY)) {
                    this.gridX = newX;
                    this.gridY = newY;
                }

                // Only continue moving if the key is still held and we can move in that direction
                if (this.nextDirection === this.direction && this.canMoveInDirection(this.direction)) {
                    this.isMoving = true;
                }
            }

            // Update pixel position with smoother movement
            const [targetX, targetY] = this.getPixelPosition(this.direction);
            this.x = targetX;
            this.y = targetY;
        }
        // If we're not moving, try to start moving
        else if (this.nextDirection && this.canMoveInDirection(this.nextDirection)) {
            this.direction = this.nextDirection;
            this.isMoving = true;
        }
    }

    canMoveInDirection(direction) {
        const [nextX, nextY] = this.getNextPosition(direction);
        return this.canMove(nextX, nextY);
    }

    getNextPosition(direction) {
        let nextX = this.gridX;
        let nextY = this.gridY;
        
        switch(direction) {
            case 'left': nextX--; break;
            case 'right': nextX++; break;
            case 'up': nextY--; break;
            case 'down': nextY++; break;
        }
        
        return [nextX, nextY];
    }

    getPixelPosition(direction) {
        let targetX = this.gridX * CELL_SIZE + CELL_SIZE/2;
        let targetY = this.gridY * CELL_SIZE + CELL_SIZE/2;
        
        if (this.isMoving) {
            switch(direction) {
                case 'left':
                    targetX -= this.moveProgress * CELL_SIZE;
                    break;
                case 'right':
                    targetX += this.moveProgress * CELL_SIZE;
                    break;
                case 'up':
                    targetY -= this.moveProgress * CELL_SIZE;
                    break;
                case 'down':
                    targetY += this.moveProgress * CELL_SIZE;
                    break;
            }
        }
        
        return [targetX, targetY];
    }

    canMove(nextX, nextY) {
        // Check maze bounds
        if (nextX < 0 || nextX >= GRID_WIDTH || nextY < 0 || nextY >= GRID_HEIGHT) {
            return false;
        }
        // Check if next position is a wall
        return this.game.maze[nextY][nextX] !== 0;
    }

    draw(ctx) {
        if (this.isDying) {
            // Death animation
            this.deathProgress = Math.min(1, this.deathProgress + 0.02);
            const angle = Math.PI * 2 * (1 - this.deathProgress);
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, CELL_SIZE/2, angle/2, Math.PI * 2 - angle/2);
            ctx.lineTo(this.x, this.y);
            ctx.fillStyle = 'yellow';
            ctx.fill();
            ctx.closePath();
        } else {
            // Normal pacman drawing
            ctx.beginPath();
            ctx.arc(this.x, this.y, CELL_SIZE/2, 0, Math.PI * 2);
            ctx.fillStyle = 'yellow';
            ctx.fill();
            ctx.closePath();
        }
    }
}

class Ghost {
    constructor(game, x, y, color) {  // Add game parameter
        this.game = game;
        this.gridX = Math.floor(x / CELL_SIZE);
        this.gridY = Math.floor(y / CELL_SIZE);
        this.x = this.gridX * CELL_SIZE + CELL_SIZE/2;
        this.y = this.gridY * CELL_SIZE + CELL_SIZE/2;
        this.color = color;
        this.direction = 'right';
        this.isMoving = false;
        this.moveProgress = 0;
        this.speed = 0.05;
    }

    update() {
        if (!this.isMoving) {
            // Get valid directions
            const possibleDirections = this.getValidDirections();
            if (possibleDirections.length > 0) {
                this.direction = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
                this.isMoving = true;
                // Play ghost sound occasionally
                if (Math.random() < 0.1) {
                    soundEngine.playGhostSound();
                }
            }
        }

        if (this.isMoving) {
            this.moveProgress += this.speed;
            
            if (this.moveProgress >= 1) {
                this.moveProgress = 0;
                this.isMoving = false;
                
                // Update grid position
                const [newX, newY] = this.getNextPosition(this.direction);
                if (this.canMove(newX, newY)) {
                    this.gridX = newX;
                    this.gridY = newY;
                }
            }

            // Update pixel position
            const [targetX, targetY] = this.getPixelPosition(this.direction);
            this.x = targetX;
            this.y = targetY;
        }
    }

    getValidDirections() {
        const directions = ['up', 'down', 'left', 'right'];
        return directions.filter(dir => {
            const [nextX, nextY] = this.getNextPosition(dir);
            return this.canMove(nextX, nextY);
        });
    }

    getNextPosition(direction) {
        let nextX = this.gridX;
        let nextY = this.gridY;
        
        switch(direction) {
            case 'left': nextX--; break;
            case 'right': nextX++; break;
            case 'up': nextY--; break;
            case 'down': nextY++; break;
        }
        
        return [nextX, nextY];
    }

    getPixelPosition(direction) {
        let targetX = this.gridX * CELL_SIZE + CELL_SIZE/2;
        let targetY = this.gridY * CELL_SIZE + CELL_SIZE/2;
        
        if (this.isMoving) {
            switch(direction) {
                case 'left':
                    targetX -= this.moveProgress * CELL_SIZE;
                    break;
                case 'right':
                    targetX += this.moveProgress * CELL_SIZE;
                    break;
                case 'up':
                    targetY -= this.moveProgress * CELL_SIZE;
                    break;
                case 'down':
                    targetY += this.moveProgress * CELL_SIZE;
                    break;
            }
        }
        
        return [targetX, targetY];
    }

    canMove(nextX, nextY) {
        // Check maze bounds
        if (nextX < 0 || nextX >= GRID_WIDTH || nextY < 0 || nextY >= GRID_HEIGHT) {
            return false;
        }
        // Check if next position is a wall
        return this.game.maze[nextY][nextX] !== 0;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, CELL_SIZE/2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

class Pellet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, CELL_SIZE/6, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('startButton');
    const startScreen = document.getElementById('startScreen');

    startButton.addEventListener('click', () => {
        startScreen.style.display = 'none';
        new Game();
    });
});

// Add volume control to the game
document.addEventListener('keydown', (e) => {
    if (e.key === 'm') {
        soundEngine.toggleMute();
    } else if (e.key === 'ArrowUp' && e.ctrlKey) {
        soundEngine.setVolume(soundEngine.masterGain.gain.value + 0.1);
    } else if (e.key === 'ArrowDown' && e.ctrlKey) {
        soundEngine.setVolume(soundEngine.masterGain.gain.value - 0.1);
    }
});
