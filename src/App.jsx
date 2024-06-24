import { useState, useEffect } from "react";
import axios from "axios";
import qs from "qs";

import Game from "./Game";

function App() {
  const [token, setToken] = useState("");

  useEffect(() => {
    var clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    var clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

    const headers = {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      auth: {
        username: clientId,
        password: clientSecret,
      },
    };
    const data = {
      grant_type: "client_credentials",
    };

    axios
      .post(
        "https://accounts.spotify.com/api/token",
        qs.stringify(data),
        headers
      )
      .then((response) => {
        setToken(response.data.access_token);
      })
      .catch((error) => {
        console.log("error authenticating: ", error);
      });
  }, []);

  return (
    <>
      <div>
        <h1>Guess the Piece</h1>
        <Game accessToken={token} />
      </div>
    </>
  );
}

export default App;
