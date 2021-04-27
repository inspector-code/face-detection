class Stream {
  constructor(callback, parentNodeId) {
    this.callback = callback;
    this.parentNode = parentNodeId;
    this.video = document.createElement('video');
    this.video.setAttribute('autoplay', '1');
    this.video.setAttribute('playsinline', '1');
    this.video.setAttribute('width', '640');
    this.video.setAttribute('height', '480');
    this.parentNode.prepend(this.video);

    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then((stream) => {
        this.video.srcObject = stream;
        const mask = document.createElement('div');
        mask.id = 'videoMask';
        this.parentNode.prepend(mask);
        this.update();
      });
  }

  update = () => {
    const loop = () => {
      this.callback(this.video);
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  };
}

export default Stream;
