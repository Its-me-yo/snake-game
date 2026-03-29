const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [{ x: 10, y: 10 }];
let velocity = { x: 0, y: 0 };
let food = { x: 5, y: 5 };
let score = 0;

const scoreEl = document.getElementById("score");
const restartBtn = document.getElementById("restartBtn");

// Game loop
function gameLoop() {
  update();
  draw();
}

function update() {
  // 🚫 Do nothing until player starts moving
  if (velocity.x === 0 && velocity.y === 0) return;

  const head = {
    x: snake[0].x + velocity.x,
    y: snake[0].y + velocity.y
  };

  // Wall collision
  if (
    head.x < 0 || head.x >= tileCount ||
    head.y < 0 || head.y >= tileCount
  ) {
    resetGame();
    return;
  }

  // Self collision (skip checking the new head position)
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      resetGame();
      return;
    }
  }

  snake.unshift(head);

  // Food collision
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.textContent = score;
    spawnFood();
  } else {
    snake.pop();
  }
}

function draw() {
  ctx.fillStyle = "#222";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // // Snake
  // ctx.fillStyle = "lime";
  // snake.forEach(part => {
  //   ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
  // });
  snake.forEach((part, index) => {
  // Gradient / rainbow effect
  const hue = (index * 20 + performance.now() / 10) % 360;
  ctx.fillStyle = `hsl(${hue}, 80%, 50%)`;

  // Draw triangle pointing in the movement direction
  const x = part.x * gridSize + gridSize / 2;
  const y = part.y * gridSize + gridSize / 2;

  ctx.beginPath();
  
  // Determine triangle orientation based on velocity (for the head)
  let angle = 0;
  if (index === 0) {
    if (velocity.x === 1) angle = 0;        // Right
    else if (velocity.x === -1) angle = Math.PI; // Left
    else if (velocity.y === 1) angle = Math.PI/2; // Down
    else if (velocity.y === -1) angle = -Math.PI/2; // Up
  }

  // Triangle points
  ctx.moveTo(x + gridSize/2 * Math.cos(angle), y + gridSize/2 * Math.sin(angle));
  ctx.lineTo(x + gridSize/2 * Math.cos(angle + 2.5), y + gridSize/2 * Math.sin(angle + 2.5));
  ctx.lineTo(x + gridSize/2 * Math.cos(angle - 2.5), y + gridSize/2 * Math.sin(angle - 2.5));
  ctx.closePath();
  ctx.fill();
});

  // Food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function spawnFood() {
  food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  };
}

function resetGame() {
  alert("Game Over! Score: " + score);
  snake = [{ x: 10, y: 10 }];
  velocity = { x: 0, y: 0 };
  score = 0;
  scoreEl.textContent = score;
}

// Controls (keyboard)
document.addEventListener("keydown", e => {
  switch (e.key) {
    case "ArrowUp":
      if (velocity.y !== 1) velocity = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      if (velocity.y !== -1) velocity = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      if (velocity.x !== 1) velocity = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      if (velocity.x !== -1) velocity = { x: 1, y: 0 };
      break;
  }
});

// Restart button
restartBtn.addEventListener("click", resetGame);

// Start game loop
setInterval(gameLoop, 150);
