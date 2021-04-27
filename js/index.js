import Stream from './Stream.js';
import Pico from './Pico.js';
import createImg from './createImg.js';

let isCaptured = false;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const parentNode = document.getElementById('face-detector');
const cascadeUrl = 'https://raw.githubusercontent.com/nenadmarkus/pico/c2e81f9d23cc11d1a612fd21e4f9de0921a5d0d9/rnt/cascades/facefinder';
const pico = new Pico(ctx, cascadeUrl).init();

const processFn = function (video) {
  ctx.drawImage(video, 0, 0);
  const detections = pico.detect();

  for (let i = 0; i < detections.length; ++i) {
    const x = detections[i][1];
    const y = detections[i][0];
    const r = detections[i][2] / 2;
    const d = r * 2;

    if (detections[i][3] > 50.0) {
      const isCentered = (x > 315) && (x < 325) && (y > 260) && (y < 270);
      const normalSize = (d > 267) && (d < 273);
      const smallSize = d < 267;
      const bigSize = d > 273;

      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2*Math.PI, false);
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'red';
      ctx.stroke();

      if (isCentered && normalSize) {
        if (!isCaptured) {
          isCaptured = true;
          const dataUrl = canvas.toDataURL();
          const img = createImg(dataUrl);
          document.body.append(img);
        }
      }

      if (isCentered && bigSize) {
        videoMask.innerHTML = '<p>Move&nbsp;away</p>';
      }

      if (isCentered && smallSize) {
        videoMask.innerHTML = '<p>Move&nbsp;closer</p>';
      }

      if (!isCentered) {
        videoMask.innerHTML = '<p>Not&nbsp;in&nbsp;the&nbsp;center</p>';
      }
    }
  }
};

new Stream(processFn, parentNode);
