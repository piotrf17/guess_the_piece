import { useState, useEffect } from "react";
import axios from "axios";

import Question from "./Question";

const getShuffledTracks = async (spotify, playlistId) => {
  //  const playlist = await spotify.getPlaylist(playlistId);
  //  const tracks = playlist.tracks.items.map((data) => data.track.id);
  const tracks = [
    "0mrL0X7fb7XDQ0l3zeimbx",
    "1mEuzWNrAMCV6ScU3EH4lR",
    "703iyFFCGrfBxVIFQ1MZ7O",
    "6Zi3EhHKlDGD89MPkAZpID",
    "77ZoOb4JI4dKSAHGTOCu7A",
    "1ZVHnyx8JfT3SBEELXOrwF",
  ];
  const shuffledTracks = tracks
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);

  return shuffledTracks;
};

const Game = ({ player, spotify }) => {
  const [tracks, setTracks] = useState([]);
  const [index, setIndex] = useState(0);

  const playlistId = "2xyC9IAQOMsLrlnGgq74lX";

  useEffect(() => {
    getShuffledTracks(spotify, playlistId).then((shuffledTracks) => {
      setTracks(shuffledTracks);
    });
  }, []);

  const handleNext = () => {
    setIndex(index + 1);
  };

  return (
    <div>
      {tracks.length > 0 && (
        <div>
          <h3>Question #{index + 1}</h3>
          <Question
            key={index}
            player={player}
            spotify={spotify}
            trackId={tracks[index]}
          />
          <button onClick={handleNext}>Next</button>
        </div>
      )}
    </div>
  );
};

export default Game;
