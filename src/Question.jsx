import { useState, useEffect } from "react";
import axios from "axios";

const Question = ({ accessToken, trackId }) => {
  const [controller, setController] = useState(null);
  const [duration, setDuration] = useState(0);
  const [answer, setAnswer] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    window.onSpotifyIframeApiReady = (IFrameAPI) => {
      const element = document.getElementById("embed-iframe");
      if (element == null) return;
      const options = {
        width: "100%",
        height: "1",
        uri: `spotify:track:${trackId}`,
      };
      const callback = (EmbedController) => {
        setController(EmbedController);
      };
      IFrameAPI.createController(element, options, callback);
    };
    if (accessToken == "") {
      return;
    }
    const headers = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    axios
      .get(`https://api.spotify.com/v1/tracks/${trackId}`, headers)
      .then((response) => {
        console.log("track duration: ", response.data.duration_ms);
        setDuration(response.data.duration_ms);
        setAnswer(response.data.artists[0].name + " --- " + response.data.name);
      })
      .catch((error) => {
        console.log("error fetching track:", error.response.data.error);
      });

    return () => {
      if (controller == null) return;
      controller.destroy();
    };
  }, [accessToken, trackId]);

  const handleStart = () => {
    const fraction = 0.2 + 0.6 * Math.random();
    const seekSeconds = (duration / 1000.0) * fraction;
    console.log("seeking to ", seekSeconds);
    controller.seek(seekSeconds);
    controller.togglePlay();
    setTimeout(() => {
      console.log("pausing");
      controller.pause();
    }, 30 * 1000);
  };

  return (
    <>
      {controller !== null && duration > 0 && (
        <div>
          <button onClick={handleStart}>Play Sample</button>
          <button
            onClick={() => {
              setShowAnswer(true);
            }}
          >
            Reveal Answer
          </button>
          {showAnswer && <p>{answer}</p>}
        </div>
      )}
    </>
  );
};

export default Question;
