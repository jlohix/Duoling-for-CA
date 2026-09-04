BAT SWING MASCOT — CLEAN FRAME VERSION
======================================

WHAT WAS FIXED
--------------
Every animation frame now contains ONLY ONE connected mascot+bat pose.

The old version used rectangular crops, which could include part of the bat
from the pose beside it. This version extracts the actual connected pixels
of each pose, so neighboring poses are completely removed.

FILES
-----
index.html
style.css
script.js
bat_swing_clean.webp
bat_swing_clean.gif
frames/frame_01.png ... frame_07.png

HOW TO TEST
-----------
1. Extract this ZIP.
2. Open index.html in Chrome/Safari/Edge.
3. Click "Test swing".

HOW TO USE IN YOUR QUIZ
-----------------------
Keep the frames folder and script.js in your website.

Your HTML can contain:

<img id="batMascot" src="frames/frame_01.png" alt="Mascot">

Then trigger the swing for a wrong answer with:

playBatSwing();

Example:

if (selectedAnswer !== correctAnswer) {
  playBatSwing();
}

If you prefer a simple always-playing image instead of JavaScript:

<img src="bat_swing_clean.webp" alt="Bat swing mascot">
