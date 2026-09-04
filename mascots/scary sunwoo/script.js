const batMascot = document.getElementById("batMascot");
const swingButton = document.getElementById("swingButton");

const batFrames = [
  "frames/frame_01.png",
  "frames/frame_02.png",
  "frames/frame_03.png",
  "frames/frame_04.png",
  "frames/frame_05.png",
  "frames/frame_06.png",
  "frames/frame_07.png"
];

const batFrameDurations = [220, 150, 95, 85, 110, 155, 280];

let batSwingPlaying = false;

// Preload every frame so there is no flashing while the swing plays.
batFrames.forEach(src => {
  const image = new Image();
  image.src = src;
});

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function playBatSwing() {
  if (batSwingPlaying) return;

  batSwingPlaying = true;

  for (let i = 0; i < batFrames.length; i++) {
    batMascot.src = batFrames[i];
    await wait(batFrameDurations[i]);
  }

  // Return to ready position.
  batMascot.src = batFrames[0];
  batSwingPlaying = false;
}

swingButton?.addEventListener("click", playBatSwing);

// Lets the rest of your quiz website call it directly.
window.playBatSwing = playBatSwing;
