class FaceDetector {
  constructor(canvas, parentNode) {
    this.isCaptured = false;
    this.canvas = canvas;
    this.parentNode = parentNode;
    this.tips = document.createElement('p');
    this.tips.innerText = 'Put your face in the zone';
    this.parentNode.prepend(this.tips);
  }

  detectFace(detections) {
    for (let i = 0; i < detections.length; ++i) {
      const x = detections[i][1];
      const y = detections[i][0];
      const r = detections[i][2] / 2;
      const d = r * 2;

      if (detections[i][3] > 50.0) {
        const isCentered = (x > 314) && (x < 326) && (y > 259) && (y < 271);
        const normalSize = (d > 267) && (d < 273);
        const smallSize = d < 267;
        const bigSize = d > 273;

        if (isCentered && normalSize) {
          if (!this.isCaptured) {
            this.isCaptured = true;
            const dataUrl = this.canvas.toDataURL();
            this.createImg(dataUrl);
          }
        }

        if (isCentered && bigSize) {
          this.tips.innerText = `Move far away`;
        }

        if (isCentered && smallSize) {
          this.tips.innerText = 'Move closer';
        }

        if (!isCentered) {
          this.tips.innerText = 'Not in the center';
        }
      }
    }
  }

  createImg(data) {
    const img = document.createElement('img');
    img.src = data;
    img.id = 'screenshot';
    document.body.prepend(img);
  }
}

export default FaceDetector;
