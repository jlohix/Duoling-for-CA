import { useEffect, useRef, useState } from "react";

const PACKS = {
  happy: {
    frames: [
      "/mascots/happy-sunwoo/frames/frame_01.png",
      "/mascots/happy-sunwoo/frames/frame_02.png",
      "/mascots/happy-sunwoo/frames/frame_03.png",
      "/mascots/happy-sunwoo/frames/frame_04.png",
      "/mascots/happy-sunwoo/frames/frame_05.png",
      "/mascots/happy-sunwoo/frames/frame_06.png",
      "/mascots/happy-sunwoo/frames/frame_07.png",
      "/mascots/happy-sunwoo/frames/frame_08.png",
    ],
    times: [150, 120, 110, 130, 110, 120, 140, 260],
    alt: "Sunwoo celebrating",
  },
  scary: {
    frames: [
      "/mascots/scary-sunwoo/frames/frame_01.png",
      "/mascots/scary-sunwoo/frames/frame_02.png",
      "/mascots/scary-sunwoo/frames/frame_03.png",
      "/mascots/scary-sunwoo/frames/frame_04.png",
      "/mascots/scary-sunwoo/frames/frame_05.png",
      "/mascots/scary-sunwoo/frames/frame_06.png",
      "/mascots/scary-sunwoo/frames/frame_07.png",
    ],
    times: [220, 150, 95, 85, 110, 155, 280],
    alt: "Sunwoo swinging a bat",
  },
};

const preloaded = new Set();

function preload(frames) {
  frames.forEach((src) => {
    if (preloaded.has(src)) return;
    preloaded.add(src);
    const image = new Image();
    image.src = src;
  });
}

export default function QuizMascot({ mood, playKey }) {
  const pack = PACKS[mood];
  const [src, setSrc] = useState(pack?.frames[0] || "");
  const cancelRef = useRef(0);

  useEffect(() => {
    if (pack) preload(pack.frames);
  }, [pack]);

  useEffect(() => {
    if (!pack) return undefined;
    const token = cancelRef.current + 1;
    cancelRef.current = token;
    setSrc(pack.frames[0]);

    let cancelled = false;
    (async () => {
      while (!cancelled && cancelRef.current === token) {
        for (let i = 0; i < pack.frames.length; i += 1) {
          if (cancelled || cancelRef.current !== token) return;
          setSrc(pack.frames[i]);
          await new Promise((resolve) => {
            setTimeout(resolve, pack.times[i]);
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mood, playKey, pack]);

  if (!pack) return null;

  return (
    <div className={`quiz-mascot quiz-mascot-${mood}`}>
      <img src={src} alt={pack.alt} />
    </div>
  );
}
