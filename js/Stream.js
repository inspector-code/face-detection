class Stream {
  constructor(ctx, parentNodeId, faceDetector, pico) {
    this.pico = pico;
    this.ctx = ctx;
    this.faceDetector = faceDetector;
    this.parentNode = parentNodeId;
    this.video = document.createElement('video');
    this.video.setAttribute('autoplay', '1');
    this.video.setAttribute('playsinline', '1');
    this.video.setAttribute('width', '640');
    this.video.setAttribute('height', '480');
    this.parentNode.prepend(this.video);
    this.raf = null;
    this.mask = document.createElement('div');
    this.mask.id = 'videoMask';
    this.parentNode.prepend(this.mask);
    this.logo = document.createElement('img');
    this.logo.id = 'logo';
    this.logo.src = './img/regula.png';
    this.parentNode.prepend(this.logo);
    this.startButton = document.createElement('button');
    this.startButton.innerText = 'Try again';
    this.parentNode.append(this.startButton);
    this.startButton.onclick = () => this.startStream();
    window.stream = this;
  }

  update = () => {
    const loop = () => {
      this.processFn(this.video);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  };

  stopStream() {
    cancelAnimationFrame(this.raf);
    this.video.srcObject.getTracks().forEach((track) => track.stop());
    [this.video, this.mask, this.logo].forEach((el) => {
      el.style.display = 'none';
    });
    this.startButton.style.display = 'inline-flex';
  }

  startStream() {
    this.faceDetector.isCaptured = false;
    const img = document.getElementById('screenshot');
    if (img) img.remove();
    [this.video, this.mask, this.logo].forEach((el) => {
      el.style.display = 'block';
    });
    this.startButton.style.display = 'none';
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
      .then((stream) => {
        this.video.srcObject = stream;
        this.update();
      });
  }

  processFn() {
    this.ctx.drawImage(this.video, 0, 0);
    this.faceDetector.detectFace(this.pico.detect());
    if (this.faceDetector.isCaptured) {
      this.stopStream();
    }
  }
}

export default Stream;
