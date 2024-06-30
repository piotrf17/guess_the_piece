import axios from "axios";
import qs from "qs";

class Spotify {
  constructor(accessToken) {
    this.accessToken = accessToken;
  }

  async getPlaylist(playlistId) {
    return this.get(`https://api.spotify.com/v1/playlists/${playlistId}`);
  }

  async getTrack(trackId) {
    return this.get(`https://api.spotify.com/v1/tracks/${trackId}`);
  }

  async get(method) {
    const headers = {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    };
    try {
      const response = await axios.get(method, headers);
      return response.data;
    } catch (error) {
      console.log("spotify error:", error.response.data.error);
      throw error;
    }
  }
}

export const createSpotify = async (clientId, clientSecret) => {
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

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      qs.stringify(data),
      headers
    );
    return new Spotify(response.data.access_token);
  } catch (error) {
    console.log("error authenticating: ", error);
    throw error;
  }
};
