const mascot = document.getElementById("celebrateMascot");
const playBtn = document.getElementById("playBtn");

const frames = [
  "frames/frame_01.png",
  "frames/frame_02.png",
  "frames/frame_03.png",
  "frames/frame_04.png",
  "frames/frame_05.png",
  "frames/frame_06.png",
  "frames/frame_07.png",
  "frames/frame_08.png"
];

const frameTimes = [150, 120, 110, 130, 110, 120, 140, 260];
let playing = false;

// Preload.
frames.forEach(src => {
  const image = new Image();
  image.src = src;
});

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function playCelebrate() {
  if (playing) return;
  playing = true;

  // IMPORTANT: only ONE <img> exists.
  // Its src is replaced frame-by-frame, so frames cannot visually stack.
  for (let i = 0; i < frames.length; i++) {
    mascot.src = frames[i];
    await wait(frameTimes[i]);
  }

  mascot.src = frames[0];
  playing = false;
}

playBtn?.addEventListener("click", playCelebrate);
window.playCelebrate = playCelebrate;
