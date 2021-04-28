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
    this.raf = null;
  }

  update = () => {
    if (this.faceDetector.isCaptured) {
      cancelAnimationFrame(this.raf);
      this.stopStream();
      return;
    }
    this.ctx.drawImage(this.video, 0, 0);
    this.faceDetector.detectFace(this.pico.detect());
    this.raf = requestAnimationFrame(this.update);
  };

  stopStream() {
    this.video.srcObject.getTracks().forEach((track) => track.stop());
    [this.video, this.mask, this.logo].forEach((el) => {
      el.style.display = 'none';
    });
    this.faceDetector.tips.innerText = '';
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
        setTimeout(() => {
          this.pico.init();
          this.raf = requestAnimationFrame(this.update);
        }, 1000)
      });
  }
}

export default Stream;
