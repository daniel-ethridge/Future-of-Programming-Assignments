const canvas = document.getElementById('canvas');
const previewCanvas = document.getElementById('preview');
const previewCtx = previewCanvas.getContext('2d');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

const balls = [];

// Add after canvas setup
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function createCollisionSound(size1, size2, speed) {
    if (!soundEnabled) return;
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    // Map ball sizes to frequency (larger = lower pitch)
    const avgSize = (size1 + size2) / 2;
    const frequency = 1000 - (avgSize * 8);
    
    // Map collision speed to volume
    const volume = Math.min(Math.abs(speed) / 20, 1) * 0.3;
    
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    oscillator.frequency.value = frequency;
    gainNode.gain.value = 0;
    
    oscillator.start();
    
    // Quick volume ramp for click sound
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, audioCtx.currentTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.08);
    
    // Cleanup
    setTimeout(() => {
        oscillator.stop();
        oscillator.disconnect();
        gainNode.disconnect();
    }, 100);
}

class Ball {
    constructor(random = false) {
        if (random) {
            this.radius = Math.random() * 45 + 5; // 5 to 50
            const speed = Math.random() * 14 + 1; // 1 to 15
            this.x = Math.random() * (canvas.width - 2 * this.radius) + this.radius;
            this.y = Math.random() * (canvas.height - 2 * this.radius) + this.radius;
            this.dx = (Math.random() - 0.5) * speed;
            this.dy = (Math.random() - 0.5) * speed;
            this.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
        } else {
            const sizeRange = document.getElementById('sizeRange');
            const speedRange = document.getElementById('speedRange');
            const colorPicker = document.getElementById('colorPicker');
            
            this.radius = parseInt(sizeRange.value);
            const speed = parseInt(speedRange.value);
            this.x = Math.random() * (canvas.width - 2 * this.radius) + this.radius;
            this.y = Math.random() * (canvas.height - 2 * this.radius) + this.radius;
            this.dx = (Math.random() - 0.5) * speed;
            this.dy = (Math.random() - 0.5) * speed;
            this.color = colorPicker.value || `hsl(${Math.random() * 360}, 70%, 50%)`;
        }
        
        // Add collision tracking
        this.recentCollisions = [];
        this.lastCleanup = Date.now();
    }

    // Add method to track collisions
    addCollision() {
        const now = Date.now();
        this.recentCollisions.push(now);
        
        // Remove collisions older than 1 second
        this.recentCollisions = this.recentCollisions.filter(time => 
            now - time < 1000
        );

        // Check for too many recent collisions
        return this.recentCollisions.length > 10;
    }

    // Add method to check if ball is off screen
    isOffScreen() {
        return this.x < -100 || 
               this.x > canvas.width + 100 || 
               this.y < -100 || 
               this.y > canvas.height + 100;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        // Wall collision
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
            if (this.addCollision()) return true;
            createCollisionSound(this.radius, this.radius, Math.abs(this.dx));
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy;
            if (this.addCollision()) return true;
            createCollisionSound(this.radius, this.radius, Math.abs(this.dy));
        }

        // Ball collision
        let shouldRemove = false;
        balls.forEach(ball => {
            if (ball === this) return;
            
            const dx = ball.x - this.x;
            const dy = ball.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.radius + ball.radius) {
                if (this.addCollision()) shouldRemove = true;
                
                // Calculate collision speed
                const relativeSpeed = Math.sqrt(
                    Math.pow(this.dx - ball.dx, 2) + 
                    Math.pow(this.dy - ball.dy, 2)
                );
                
                createCollisionSound(this.radius, ball.radius, relativeSpeed);

                // Simple collision response
                const angle = Math.atan2(dy, dx);
                const sin = Math.sin(angle);
                const cos = Math.cos(angle);

                // Rotate velocities
                const vx1 = this.dx * cos + this.dy * sin;
                const vy1 = this.dy * cos - this.dx * sin;
                const vx2 = ball.dx * cos + ball.dy * sin;
                const vy2 = ball.dy * cos - ball.dx * sin;

                // Swap the x velocities
                this.dx = vx2 * cos - vy1 * sin;
                this.dy = vy1 * cos + vx2 * sin;
                ball.dx = vx1 * cos - vy2 * sin;
                ball.dy = vy2 * cos + vx1 * sin;
            }
        });

        this.x += this.dx;
        this.y += this.dy;

        // Check for off-screen or too many collisions
        return shouldRemove || this.isOffScreen();
    }
}

class PreviewBall {
    constructor() {
        this.update();
    }

    update() {
        const sizeRange = document.getElementById('sizeRange');
        const colorPicker = document.getElementById('colorPicker');
        
        this.radius = parseInt(sizeRange.value);
        this.color = colorPicker.value;
    }

    draw() {
        previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        previewCtx.beginPath();
        previewCtx.arc(
            previewCanvas.width / 2,
            previewCanvas.height / 2,
            Math.min(this.radius, 40),
            0,
            Math.PI * 2
        );
        previewCtx.fillStyle = this.color;
        previewCtx.fill();
        previewCtx.closePath();
    }
}

const previewBall = new PreviewBall();

function addBall() {
    balls.push(new Ball());
}

function addRandomBalls() {
    const count = parseInt(document.getElementById('batchSize').value) || 1;
    for (let i = 0; i < Math.min(count, 100); i++) {
        balls.push(new Ball(true));
    }
}

function clearBalls() {
    balls.length = 0;
}

function handleClick(event) {
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    for (let i = balls.length - 1; i >= 0; i--) {
        const ball = balls[i];
        const dx = clickX - ball.x;
        const dy = clickY - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= ball.radius) {
            balls.splice(i, 1);
            break;
        }
    }
}

// Event listeners
canvas.addEventListener('click', handleClick);

// Add event listeners for controls
document.getElementById('sizeRange').addEventListener('input', updatePreview);
document.getElementById('colorPicker').addEventListener('input', updatePreview);

// Initialize color picker with random color
document.getElementById('colorPicker').value = `#${Math.floor(Math.random()*16777215).toString(16)}`;

function updatePreview() {
    previewBall.update();
    previewBall.draw();
}

// Initialize preview
updatePreview();

function animate() {
    ctx.fillStyle = 'rgba(26, 26, 26, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and remove problematic balls
    for (let i = balls.length - 1; i >= 0; i--) {
        const ball = balls[i];
        if (ball.update()) {
            balls.splice(i, 1);
            continue;
        }
        ball.draw();
    }

    requestAnimationFrame(animate);
}

// Add initial balls
for (let i = 0; i < 5; i++) {
    addBall();
}

animate();

// Add volume control to controls
let soundEnabled = true;
function toggleSound() {
    soundEnabled = !soundEnabled;
    document.getElementById('soundToggle').textContent = 
        soundEnabled ? 'Sound: On' : 'Sound: Off';
}
