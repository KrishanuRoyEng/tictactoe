// 🎵 Preload all sounds
const sounds = {
    bgMusic: new Audio("bg.ogg"),
    hover: new Audio("hover.ogg"),
    move: new Audio("move.ogg"),
};

//Optimize settings
sounds.bgMusic.loop = true;
sounds.bgMusic.volume = 1;
sounds.hover.volume = 1;
sounds.move.volume = 1;

//Preload files (Ensures no delay when playing)
for (let key in sounds) {
    sounds[key].load();
}

// 🎚️ Mute button (Top Right Corner)
const muteButton = document.createElement("button");
muteButton.innerHTML = "🔇";
muteButton.id = "mute-btn";
muteButton.style.cssText = `
    position: fixed; top: 10px; right: 10px; 
    background: rgba(0, 0, 0, 0.5); color: white;
    border: none; padding: 10px; font-size: 20px; cursor: pointer;
    border-radius: 5px; z-index: 100;
`;
document.body.appendChild(muteButton);

let isMuted = true;
muteButton.addEventListener("click", () => {
    isMuted = !isMuted;
    muteButton.innerHTML = isMuted ? "🔇" : "🔊";
    sounds.bgMusic.muted = isMuted;
    sounds.hover.muted = isMuted;
    sounds.move.muted = isMuted;
    if (!isMuted) sounds.bgMusic.play(); // Auto-play music if unmuted
});

// 🎶 Hover sound for buttons
document.querySelectorAll("button").forEach(button => {
    button.addEventListener("mouseenter", () => {
        if (!isMuted) {
            sounds.hover.currentTime = 0; // Restart sound
            sounds.hover.play();
        }
    });
});

// ❌ Avoid multiple click sounds (Fixes double-click issues)
document.querySelectorAll(".cell").forEach(cell => {
    cell.addEventListener("click", () => {
        if (!isMuted) {
            sounds.move.currentTime = 0; // Restart sound
            sounds.move.play();
        }
    });
});
