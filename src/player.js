let listenerId = 0;

class Player {
  constructor(controller) {
    this.controller = controller;
    this.controller.addListener("playback_update", (e) => {
      this.playbackListeners.forEach(([key, listener]) => {
        listener(e);
      });
    });
    this.playbackListeners = [];
    this.ready = false;
    this.pauseTimeoutId = null;
  }

  async play(seekSeconds, durationSec) {
    // Clear timeout from a previous play invocation.
    if (this.pauseTimeoutId !== null) {
      clearTimeout(this.pauseTimeoutId);
    }
    // If we've just loaded the track, we need to hit play and wait
    // till it starts playing before we can seek. It seems like the
    // spotify embed API requires the track to be loaded.
    if (!this.ready) {
      this.controller.play();
      await this.playbackStarted();
      this.ready = true;
    }
    // Seek to the desired point, and play for the desired duration.
    this.controller.seek(seekSeconds);
    this.controller.play();
    return new Promise((resolve, reject) => {
      this.pauseTimeoutId = setTimeout(() => {
        this.controller.pause();
        this.pauseTimeoutId = null;
        resolve();
      }, durationSec * 1000);
    });
  }

  async loadTrack(trackId) {
    // Clear timeout from a previous play invocation.
    if (this.pauseTimeoutId !== null) {
      clearTimeout(this.pauseTimeoutId);
    }
    this.controller.loadUri(`spotify:track:${trackId}`);
    this.ready = false;
  }

  playbackStarted() {
    return new Promise((resolve, reject) => {
      const key = listenerId++;
      this.playbackListeners.push([
        key,
        (e) => {
          if (e.data.position > 0) {
            this.playbackListeners = this.playbackListeners.filter(
              ([listenerKey, listener]) => listenerKey != key
            );
            resolve();
          }
        },
      ]);
    });
  }
}

const createEmbedController = () => {
  return new Promise((resolve, reject) => {
    window.onSpotifyIframeApiReady = (IFrameAPI) => {
      const element = document.getElementById("embed-iframe");
      const options = {
        width: "1",
        height: "1",
        // Load a random track at the start.
        uri: "spotify:track:77ZoOb4JI4dKSAHGTOCu7A",
      };
      const callback = (EmbedController) => {
        resolve(EmbedController);
      };
      IFrameAPI.createController(element, options, callback);
    };
  });
};

export const createPlayer = async () => {
  const controller = await createEmbedController();
  return new Player(controller);
};
