class Stream {
  constructor(callback) {
    this.callback = callback;
    const streamContainer = document.createElement('div');
    streamContainer.className = 'container';
    this.video = document.createElement('video');
    this.video.setAttribute('autoplay', '1');
    this.video.setAttribute('playsinline', '1');
    this.video.setAttribute('width', '640');
    this.video.setAttribute('height', '480');

    streamContainer.append(this.video);
    document.body.prepend(streamContainer);

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then((stream) => {
        this.video.srcObject = stream;
        const mask = document.createElement('div');
        mask.className = 'videoMask';
        streamContainer.append(mask);
        this.update();
      });
  }

  update = () => {
    let last = Date.now();
    const loop = () => {
      const dt = Date.now() - last;
      this.callback(this.video, dt);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  };
}

export default Stream;
