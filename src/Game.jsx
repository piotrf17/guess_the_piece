import { useState, useEffect } from "react";
import axios from "axios";

import Question from "./Question";

const Game = ({ accessToken }) => {
  const [tracks, setTracks] = useState([]);
  const [index, setIndex] = useState(0);

  const playlistId = "2xyC9IAQOMsLrlnGgq74lX";

  useEffect(() => {
    if (accessToken == "") {
      return;
    }

    const headers = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    axios
      .get(`https://api.spotify.com/v1/playlists/${playlistId}`, headers)
      .then((response) => {
        const tracks = response.data.tracks.items.map((data) => data.track.id);
        const shuffledTracks = tracks
          .map((value) => ({ value, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ value }) => value);
        console.log("fetched tracks:", shuffledTracks);
        setTracks(shuffledTracks);
      })
      .catch((error) => {
        console.log("error fetching playlist:", error.response.data.error);
      });
  }, [accessToken]);

  const handleNext = () => {
    setIndex(index + 1);
  };

  return (
    <div>
      {tracks.length > 0 && (
        <div>
          <h3>Track #{index + 1}</h3>
          <Question accessToken={accessToken} trackId={tracks[index]} />
          <hr />
          <button onClick={handleNext}>Next</button>
        </div>
      )}
    </div>
  );
};

export default Game;
