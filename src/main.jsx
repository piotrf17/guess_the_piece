import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { createSpotify } from "./spotify.js";
import { createPlayer } from "./player.js";
import "./index.css";

const main = async () => {
  const player = await createPlayer();
  const spotify = await createSpotify(
    import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    import.meta.env.VITE_SPOTIFY_CLIENT_SECRET
  );
  ReactDOM.createRoot(document.getElementById("root")).render(
    <App player={player} spotify={spotify} />
  );
};

main();
