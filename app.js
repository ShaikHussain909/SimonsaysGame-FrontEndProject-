let gameSeq = [];
let userSeq = [];
let btns = ["yellow", "grey", "purple", "red"];

let started = false;
let level = 0;
let highscore = localStorage.getItem("highscore") ? parseInt(localStorage.getItem("highscore")) : 1;

let h2 = document.querySelector("h2");
let h3 = document.querySelector("h3");
let progressBar = document.getElementById("progressBar");
let soundEnabled = true;

// Preload sounds
const sounds = {
    red: new Audio("sounds/red.mp3"),
    yellow: new Audio("sounds/yellow.mp3"),
    grey: new Audio("sounds/grey.mp3"),
    purple: new Audio("sounds/purple.mp3"),
    start: new Audio("sounds/start.mp3"),
    levelup: new Audio("sounds/levelup.mp3"),
    gameover: new Audio("sounds/gameover.mp3")
};

//Toggle sound
document.getElementById("sound-toggle").addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    document.getElementById("sound-toggle").textContent = soundEnabled ? "🔊 Sound: ON" : "🔇 Sound: OFF";
});

// Start game
document.getElementById("start-btn").addEventListener("click", () => {
    if (!started) {
        started = true;
        h3.innerText = "";
        gameSeq = [];
        userSeq = [];
        level = 0;
        progressBar.style.width = "0%";
        playExtraSound("start");
        setTimeout(levelUp, 500);
    }
});

// Play sound and wait for it to finish
function playSoundSequentially(audioFile) {
    return new Promise((resolve) => {
        if (!soundEnabled) return resolve();
        const audio = new Audio(audioFile);
        audio.onended = resolve;
        audio.play();
    });
}

//  Optional delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Play sequence of sounds
async function playSequence(colors, gap = 200) {
    for (let color of colors) {
        let btn = document.getElementById(color);
        btnFlash(btn);
        await playSoundSequentially(`sounds/${color}.mp3`);
        await delay(gap);
    }
}

// Play extra sound
function playExtraSound(name) {
    if (!soundEnabled || !sounds[name]) return;
    sounds[name].currentTime = 0;
    sounds[name].play();
}

//  Button flash
function btnFlash(btn) {
    btn.classList.add("flashBtn");
    setTimeout(() => {
        btn.classList.remove("flashBtn");
    }, 500);
}

//  User flash
function userFlash(btn) {
    btn.classList.add("userFlash");
    setTimeout(() => {
        btn.classList.remove("userFlash");
    }, 500);
}

// Level up
function levelUp() {
    userSeq = [];
    level++;
    updateHighScore();
    h2.innerText = `Level ${level}`;

    let randIdx = Math.floor(Math.random() * btns.length);
    let randColor = btns[randIdx];
    gameSeq.push(randColor);

    playExtraSound("levelup");
    playSequence([randColor]);
}

// Check answer
function checkAns(idx) {
    if (userSeq[idx] === gameSeq[idx]) {
        if (userSeq.length === gameSeq.length) {
            setTimeout(levelUp, 1000);
        }
    } else {
        h2.innerHTML = `Game Over! Your score was <b>${level}</b>`;
        h3.innerHTML = `Highest Score = ${highscore}`;
        document.body.classList.add("game-over");
        document.body.style.backgroundColor = "red";
        playExtraSound("gameover");

        setTimeout(() => {
            document.body.style.backgroundColor = "white";
            document.body.classList.remove("game-over");
        }, 1000);

        reset();
    }
}

//Button press
function btnPress() {
    if (!started) return;

    let btn = this;
    userFlash(btn);

    let userColor = btn.getAttribute("id");
    userSeq.push(userColor);

    updateProgressBar();
    checkAns(userSeq.length - 1);
}

// Update progress bar
function updateProgressBar() {
    let progress = Math.floor((userSeq.length / gameSeq.length) * 100);
    progressBar.style.width = `${progress}%`;
}

// Update high score
function updateHighScore() {
    if (level > highscore) {
        highscore = level;
        localStorage.setItem("highscore", highscore);
    }
}

//  Reset game
function reset() {
    started = false;
    gameSeq = [];
    userSeq = [];
    level = 0;
    progressBar.style.width = "0%";
}

// Attach event listeners to all color buttons
for (let color of btns) {
    let btn = document.getElementById(color);
    btn.addEventListener("click", btnPress);
}
