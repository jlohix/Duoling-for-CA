CELEBRATION ANIMATION — NON-OVERLAPPING FRAMES

This package contains 8 separate PNG files.

HOW THE OVERLAP PROBLEM IS PREVENTED
------------------------------------
1. The source sheet is divided into an exact 4 x 2 grid.
2. Every crop ends exactly where the next crop starts.
3. No crop extends into a neighbouring frame.
4. The JavaScript uses ONE <img> element and changes its src.
   Therefore two frames are never displayed on top of one another.

FILES
-----
frames/frame_01.png ... frame_08.png
celebration_no_overlap.webp
celebration_no_overlap.gif
index.html
style.css
script.js

TEST
----
Extract the ZIP and open index.html.

USE IN YOUR QUIZ
----------------
When the answer is correct:

if (isCorrect) {
    playCelebrate();
}
