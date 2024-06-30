import { useState, useEffect } from "react";
import axios from "axios";
import qs from "qs";

import Game from "./Game";

function App({ player, spotify }) {
  return (
    <>
      <div>
        <h1>Guess the Piece</h1>
        <Game player={player} spotify={spotify} />
      </div>
    </>
  );
}

export default App;
