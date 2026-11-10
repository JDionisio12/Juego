// 1. Selección de elementos del DOM
const container = document.getElementById('game-container');
const player = document.getElementById('player');
const scoreEl = document.getElementById('score');
const highScoreEl = document.getElementById('high-score');
const gameOverScreen = document.getElementById('game-over-screen');
const restartBtn = document.getElementById('restart-btn');


// 2. Variables de Estado
let playerX = 60;                          // antes 180 - 120
let playerY = container.clientHeight - 380; // antes (altura - 80) - 300
const playerSpeed = 2;
let score = 0;
let gameOver = false;
let gameInterval;
let bugSpawnInterval;

// Colocamos al jugador en su posición inicial
player.style.left = `${playerX}px`;
player.style.top = `${playerY}px`;

// 3. Controles del Teclado
document.addEventListener('keydown', (e) => {
  if (gameOver) return;

  // Izquierda / derecha
  if ((e.key === 'ArrowLeft' || e.key === 'a') && playerX > 0) {
    playerX -= playerSpeed;
  }
  if ((e.key === 'ArrowRight' || e.key === 'd') && playerX < container.clientWidth - 40) {
    playerX += playerSpeed;
  }

  // Arriba / abajo
  if ((e.key === 'ArrowUp' || e.key === 'w') && playerY > 0) {
    playerY -= playerSpeed;
  }
  if ((e.key === 'ArrowDown' || e.key === 's') && playerY < container.clientHeight - 40) {
    playerY += playerSpeed;
  }

  player.style.left = `${playerX}px`;
  player.style.top = `${playerY}px`;
});

// 4. Función utilitaria para detectar colisión entre 2 elementos del DOM
function checkCollision(elem1, elem2) {
  const r1 = elem1.getBoundingClientRect();
  const r2 = elem2.getBoundingClientRect();

  return !(
    r1.top > r2.bottom ||
    r1.bottom < r2.top ||
    r1.right < r2.left ||
    r1.left > r2.right
  );
}



function poseInicial(player) {
  player.style.top = 50;
}

poseInicial(player);


let coches = [];
const carriles = [
    { x: 170, direccion: 1 }, 
    { x: 470, direccion: -1 },
    { x: 770, direccion: 1 }  
];
function crearCoche() {

   
    let carril = carriles[Math.floor(Math.random() * carriles.length)];
    let nuevoCoche = document.createElement("div");

    nuevoCoche.className = "coche";

    let posicionY;

    if (carril.direccion === 1) {
        posicionY = -100;
    } else {
        posicionY = container.clientHeight;
    }

    nuevoCoche.style.left = carril.x + "px";
    nuevoCoche.style.top = posicionY + "px";

    container.appendChild(nuevoCoche);
    coches.push({
        elemento: nuevoCoche, y: posicionY, velocidad: 20,
        direccion: carril.direccion
    });
}

crearCoche();

crearCoche();

let bugSpawnInterval2 = setInterval(function() {
    crearCoche();
}, 1500);

let gameInterval2 = setInterval(function() {

    for (let i = 0; i < coches.length; i++) {

        let coche = coches[i];
          coche.y += coche.velocidad * coche.direccion;
          coche.elemento.style.top = coche.y + "px";
        if (
            coche.y > container.clientHeight ||
            coche.y < -100
        ) {
            coche.elemento.remove();
            coches.splice(i, 1);
            i--;
        }
    }

}, 20);






function terminarJuego() {
  gameOver = true;
  clearInterval(bugSpawnInterval2);
  clearInterval(gameInterval2);
  gameOverScreen.classList.remove('hidden');
}

restartBtn.addEventListener('click', () => {
  location.reload(); // la forma más simple de reiniciar
});

let gameInterval3 = setInterval(function() {

    for (let i = 0; i < coches.length; i++) {

        let coche = coches[i];
        coche.y += coche.velocidad * coche.direccion;
        coche.elemento.style.top = coche.y + "px";

        // ¡Colisión con el jugador!
        if (checkCollision(player, coche.elemento)) {
            terminarJuego();
            return;
        }

        if (coche.y > container.clientHeight || coche.y < -100) {
            coche.elemento.remove();
            coches.splice(i, 1);
            i--;
        }
    }

}, 20);