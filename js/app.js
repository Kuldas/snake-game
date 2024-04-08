// Events
document.addEventListener("keydown", keyPush);    // Event listener pro zachycení kláves

// Canvas
const canvas = document.querySelector("canvas");	// Výběr elementu pro vykreslení hry
const ctx = canvas.getContext("2d");	// Kontex pro vyrendrování
const canvasBackground = "#C7C7C7";    // Barva pozadí hry

// Game
const gameVersion = "0.1.0";	// Verze hry "Hladová hadice"

let gameIsRunning = true;    // Běži hra (hra se vypne při gameOver nebo gameWinner)

const fps = 10;    // Určuje rychlost hada
const tileSize = 25;	// Velikost hada
const tileCountRow = canvas.width / tileSize;    // Počet dlaždic v řádku
const tileCountCol = canvas.height / tileSize;    // Počet dlaždic ve sloupci
const gameVersionDisplay = document.getElementById("gameVersion");    // Výběr elementu pro zobrazení verze hry
const gameOverDisplay = document.getElementById("gameOver");	// Výběr elementu pro zobrazení prohry
const gameWinnerDIsplay = document.getElementById("gameWinner");	// Výběr elementu pro zobrazení výhry

// Player
const playerColor = "#000000";	// Barva hada
const playerScoreDisplay = document.getElementById("playerScore");		// Výběr elementu pro zobrazení skóre

let playerSpeed = tileSize;		// Rychlost hada (používá se velikost)
let playerPosX = 25;	// Pozice hráče na ose X
let playerPosY = canvas.height;		// Pozice hráče na ose Y
let playerScore = 0;	// Skóre hráče (v základu 0)

let velocityX = 1;
let velocityY = 0;

let tail = [];    // Ocas hadice uložená v poli
let snakeLenght = 2;	// Výchozí délka hada

// Jídlo pro hadíka
const foodColor = "#3285a8";	// Barva jídla pro hadici

let foodPosX = 0;	// Výchozí pozice jídla na ose X
let foodPosY = 0;	// Výchozí pozice jídla na ose Y

/**
 * Začátek hry
 */

function gameLoop() {
	if ( gameIsRunning ) {
		gameDraw();
		gameMoves();
		setTimeout(gameLoop, 1000 / fps);
		//requestAnimationFrame(gameLoop);
	}
}

foodPosReset();
gameLoop();
gameVersionDisplay.textContent = gameVersion;

function gameMoves() {
	playerPosX += playerSpeed * velocityX;
	playerPosY += playerSpeed * velocityY;

	// Kontrola kolize se stěnou
	if (playerPosX > canvas.width - tileSize) {
		playerPosX = 0;
	}
	if (playerPosX < 0) {
		playerPosX = canvas.width;
	}
	if (playerPosY > canvas.height - tileSize) {
		playerPosY = 0;
	}
	if (playerPosY < 0) {
		playerPosY = canvas.height;
	}

	// Kontrola kolize se sebou samím
	tail.forEach((snakePart) => {
		if (playerPosX === snakePart.x && playerPosY === snakePart.y) {
			gameOver();
		}
	});

	// Vytváření ocasu pro hada
	tail.push({ x: playerPosX, y: playerPosY });

	// Zapomenutí všech částí ocasu hada kromě posledních 5
	tail = tail.slice(-1 * snakeLenght);

	// Kontrola kolize s jídlem
	if (playerPosX === foodPosX && playerPosY === foodPosY) {
		playerScoreDisplay.textContent = ++playerScore;
		snakeLenght++;
		foodPosReset();
	}
}

function gameDraw() {
	// Nakreslí pozadí
	rectangle(canvasBackground, 0, 0, canvas.width, canvas.height);

	// Nakreslí mřížku
	drawGrid();

	// Nakreslí jídlo pro hadíka
	rectangle(foodColor, foodPosX, foodPosY, tileSize, tileSize);

	// Nakreslí ocas pro hada
	tail.forEach((snakePart) =>
		rectangle("#bada55", snakePart.x, snakePart.y, tileSize, tileSize)
	);

	// Nakreslí hadíka
	rectangle(playerColor, playerPosX, playerPosY, tileSize, tileSize);
}

function rectangle(color, x, y, width, height) {
	ctx.fillStyle = color;
	ctx.fillRect(x, y, width, height);
}

function foodPosReset() {
	if ( snakeLenght === tileCountRow * tileCountCol ) {
		gameWinner();
	}

	foodPosX = Math.floor(Math.random() * tileCountRow) * tileSize;
	foodPosY = Math.floor(Math.random() * tileCountCol) * tileSize;

	if ( foodPosX === playerPosX && foodPosY === playerPosY ) {
		foodPosReset();
	}

	if ( tail.some( snakePart => snakePart.x === foodPosX && snakePart.y === foodPosY ) ) {
		foodPosReset();
	}
}

function gameOver() {
	gameIsRunning = false;
	gameOverDisplay.classList.remove("hidden"); 
}

function gameWinner() {
	gameIsRunning = false;
	gameWinnerDisplay.classList.remove("hidden");
}

function keyPush(event) {
	switch (event.key) {
		case "ArrowLeft":
		case "a":
			if (velocityX !== 1) {
				velocityX = -1;
				velocityY = 0;
			}
			break;
		case "ArrowUp":
		case "w":
			if (velocityY !== 1) {
				velocityX = 0;
				velocityY = -1;
			}
			break;
		case "ArrowRight":
		case "d":
			if (velocityX !== -1) {
				velocityX = 1;
				velocityY = 0;
			}
			break;
		case "ArrowDown":
		case "s":
			if (velocityY !== -1) {
				velocityX = 0;
				velocityY = 1;
			}
			break;
		case "r":
			if ( !gameIsRunning ) {
				location.reload();
			}
	}
}

function drawGrid() {
	for (let row = 0; row < tileCountRow; row++) {
		for (let col = 0; col < tileCountCol; col++) {
			rectangle(
				"#fff",
				tileSize * row,
				tileSize * col,
				tileSize - 1,
				tileSize - 1
			);
		}
	}
}