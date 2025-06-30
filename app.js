const player = document.querySelector('.player');
const gameContainer = document.querySelector('.game-container');
const scoreSpan = document.querySelector('.score span');
const livesSpan = document.querySelector('.lives span');
const gameOverContainer = document.querySelector('.game-over-container');
const restartButton = document.querySelector('.restart-button');

let score = 0;
let lives = 3;
let playerX = 375;
let gameOver = false;
let alienInterval;

function updatePlayerPosition() {
    player.style.left = `${playerX}px`;
}

function movePlayer(e) {
    if (gameOver) return;
    if (e.key === 'ArrowLeft' && playerX > 0) {
        playerX -= 15;
    } else if (e.key === 'ArrowRight' && playerX < 750) {
        playerX += 15;
    }
    updatePlayerPosition();
}

function createBullet() {
    const bullet = document.createElement('div');
    bullet.classList.add('bullet');
    bullet.style.left = `${playerX + 20}px`;
    bullet.style.bottom = '60px';
    gameContainer.appendChild(bullet);
    moveBullet(bullet);
}

function moveBullet(bullet) {
    let bulletInterval = setInterval(() => {
        if (gameOver) {
            clearInterval(bulletInterval);
            bullet.remove();
            return;
        }
        let bulletBottom = parseInt(bullet.style.bottom);
        if (bulletBottom > 600) {
            bullet.remove();
            clearInterval(bulletInterval);
        } else {
            bullet.style.bottom = `${bulletBottom + 10}px`;
            checkCollision(bullet, bulletInterval);
        }
    }, 20);
}

function createAlien() {
    const alien = document.createElement('div');
    alien.classList.add('alien');
    alien.style.left = `${Math.random() * 750}px`;
    alien.style.top = '0px';
    gameContainer.appendChild(alien);
    moveAlien(alien);
}

function moveAlien(alien) {
    let alienMoveInterval = setInterval(() => {
        if (gameOver) {
            clearInterval(alienMoveInterval);
            alien.remove();
            return;
        }
        let alienTop = parseInt(alien.style.top);
        if (alienTop > 550) {
            alien.remove();
            clearInterval(alienMoveInterval);
            lives--;
            livesSpan.textContent = lives;
            if (lives === 0) {
                endGame();
            }
        } else {
            alien.style.top = `${alienTop + 2}px`;
        }
    }, 30);
}

function checkCollision(bullet, bulletInterval) {
    const aliens = document.querySelectorAll('.alien');
    aliens.forEach(alien => {
        const bulletRect = bullet.getBoundingClientRect();
        const alienRect = alien.getBoundingClientRect();

        if (
            bulletRect.left < alienRect.right &&
            bulletRect.right > alienRect.left &&
            bulletRect.top < alienRect.bottom &&
            bulletRect.bottom > alienRect.top
        ) {
            bullet.remove();
            alien.remove();
            score++;
            scoreSpan.textContent = score;
            clearInterval(bulletInterval);
        }
    });
}

function shoot(e) {
    if (gameOver) return;
    if (e.key === ' ') {
        createBullet();
    }
}

function endGame() {
    gameOver = true;
    gameOverContainer.style.display = 'block';
    clearInterval(alienInterval);
}

function restartGame() {
    score = 0;
    lives = 3;
    playerX = 375;
    gameOver = false;

    scoreSpan.textContent = score;
    livesSpan.textContent = lives;
    gameOverContainer.style.display = 'none';

    const aliens = document.querySelectorAll('.alien');
    aliens.forEach(alien => alien.remove());

    const bullets = document.querySelectorAll('.bullet');
    bullets.forEach(bullet => bullet.remove());

    startGame();
}

function startGame() {
    alienInterval = setInterval(createAlien, 2000);
}

document.addEventListener('keydown', movePlayer);
document.addEventListener('keydown', shoot);
restartButton.addEventListener('click', restartGame);

startGame();