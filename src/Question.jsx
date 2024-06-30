import { useState, useEffect } from "react";

const Question = ({ player, spotify, trackId }) => {
  const [trackInfo, setTrackInfo] = useState(null);
  const [seekSeconds, setSeekSeconds] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [numPlayEnabled, setNumPlayEnabled] = useState(0);

  useEffect(() => {
    player.loadTrack(trackId);
    spotify.getTrack(trackId).then((info) => {
      setTrackInfo(info);
      const durationSec = info.duration_ms / 1000.0;
      const fraction = 0.2 + 0.6 * Math.random();
      setSeekSeconds(fraction * durationSec);
    });
  }, [trackId]);

  const handleStart = (buttonNum) => {
    console.log("playing at ", seekSeconds);
    player.play(seekSeconds, 10 * buttonNum).then(() => {
      setNumPlayEnabled(Math.max(numPlayEnabled, buttonNum));
    });
  };

  const answer = (trackInfo) => {
    return trackInfo.artists[0].name + " --- " + trackInfo.name;
  };

  return (
    <>
      {trackInfo !== null && (
        <div>
          <div>
            <span>
              Play a sample:
              <button
                onClick={() => {
                  handleStart(1);
                }}
              >
                10 sec
              </button>
              <button
                disabled={numPlayEnabled < 1}
                onClick={() => {
                  handleStart(2);
                }}
              >
                20 sec
              </button>
              <button
                disabled={numPlayEnabled < 2}
                onClick={() => {
                  handleStart(3);
                }}
              >
                30 sec
              </button>
              <button disabled={numPlayEnabled < 3}>New Sample</button>
            </span>
          </div>

          <button
            onClick={() => {
              setShowAnswer(true);
            }}
          >
            Reveal Answer
          </button>
          {showAnswer && <p>{answer(trackInfo)}</p>}
        </div>
      )}
    </>
  );
};

export default Question;
