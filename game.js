const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
const scoreDisplay = document.getElementById("score");

let keys = {};

document.addEventListener("keydown", (e) => keys[e.key] = true);
document.addEventListener("keyup", (e) => keys[e.key] = false);

// Player
const player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 40,
    height: 40,
    speed: 6
};

// Bullets
let bullets = [];

// Asteroids
let asteroids = [];

// Spawn asteroid
function spawnAsteroid() {
    const size = Math.random() * 30 + 20;
    asteroids.push({
        x: Math.random() * canvas.width,
        y: -size,
        size: size,
        speed: Math.random() * 3 + 2
    });
}

setInterval(spawnAsteroid, 1000);

// Shoot bullet
function shoot() {
    bullets.push({
        x: player.x + player.width / 2 - 2,
        y: player.y,
        width: 4,
        height: 10,
        speed: 8
    });
}

document.addEventListener("keydown", (e) => {
    if (e.key === " ") shoot();
});

// Collision detection
function isColliding(a, b) {
    return a.x < b.x + b.size &&
           a.x + a.width > b.x &&
           a.y < b.y + b.size &&
           a.y + a.height > b.y;
}

// Game loop
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move player
    if (keys["ArrowLeft"] && player.x > 0) {
        player.x -= player.speed;
    }
    if (keys["ArrowRight"] && player.x < canvas.width - player.width) {
        player.x += player.speed;
    }

    // Draw player
    ctx.fillStyle = "cyan";
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Update bullets
    bullets.forEach((bullet, bIndex) => {
        bullet.y -= bullet.speed;
        ctx.fillStyle = "yellow";
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        if (bullet.y < 0) {
            bullets.splice(bIndex, 1);
        }
    });

    // Update asteroids
    asteroids.forEach((asteroid, aIndex) => {
        asteroid.y += asteroid.speed;
        ctx.fillStyle = "gray";
        ctx.fillRect(asteroid.x, asteroid.y, asteroid.size, asteroid.size);

        if (asteroid.y > canvas.height) {
            asteroids.splice(aIndex, 1);
        }

        // Check bullet collision
        bullets.forEach((bullet, bIndex) => {
            if (isColliding(bullet, asteroid)) {
                asteroids.splice(aIndex, 1);
                bullets.splice(bIndex, 1);
                score++;
                scoreDisplay.textContent = score;
            }
        });

        // Check player collision
        if (
            player.x < asteroid.x + asteroid.size &&
            player.x + player.width > asteroid.x &&
            player.y < asteroid.y + asteroid.size &&
            player.y + player.height > asteroid.y
        ) {
            alert("Game Over! Final Score: " + score);
            document.location.reload();
        }
    });

    requestAnimationFrame(update);
}

update();
