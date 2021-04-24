import Stream from './Stream.js';
import pico from './pico.js';
import createImg from './createImg.js';

const update_memory = pico.instantiate_detection_memory(5);
const cascadeUrl = 'https://raw.githubusercontent.com/nenadmarkus/pico/c2e81f9d23cc11d1a612fd21e4f9de0921a5d0d9/rnt/cascades/facefinder';
let faceFinder_classify_region;
let isCaptured = false;

fetch(cascadeUrl).then((response) => {
  response.arrayBuffer().then((buffer) => {
    const bytes = new Int8Array(buffer);
    faceFinder_classify_region = pico.unpack_cascade(bytes);
    console.log('* cascade loaded');
  });
});

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const button = document.createElement('button');
button.innerHTML = 'Clear and try again';
button.id = 'deleteButton';
button.style.display = 'none';
button.onclick = () => {
  const screen = document.getElementsByTagName('img')[0];
  screen.remove();
  isCaptured = false;
  button.style.display = 'none';
}
document.body.append(button);

function rgba_to_grayscale(rgba, nRows, nCols) {
  const gray = new Uint8Array(nRows * nCols);
  for (let r = 0; r < nRows; ++r) {
    for (let c = 0; c < nCols; ++c) {
      gray[r * nCols + c] = (2 * rgba[r * 4 * nCols + 4 * c] + 7 * rgba[r * 4 * nCols + 4 * c + 1] + 1 * rgba[r * 4 * nCols + 4 * c + 2]) / 10;
    }
  }
  return gray;
}

const processFn = function (video) {
  ctx.drawImage(video, 0, 0);
  const rgba = ctx.getImageData(0, 0, 640, 480).data;
  const image = {
    'pixels': rgba_to_grayscale(rgba, 480, 640),
    'nrows': 480,
    'ncols': 640,
    'ldim': 640
  };
  const params = {
    'shiftfactor': 0.1,
    'minsize': 100,
    'maxsize': 1000,
    'scalefactor': 1.1
  };

  let detections = pico.run_cascade(image, faceFinder_classify_region, params);
  detections = update_memory(detections);
  detections = pico.cluster_detections(detections, 0.2);

  for (let i = 0; i < detections.length; ++i) {
    let x = detections[i][1];
    let y = detections[i][0];
    let r = detections[i][2] / 3;
    let arcSide = x - r;

    if (detections[i][3] > 50.0) {
      if ((x > 310) && (x < 330) && (y > 255) && (y < 275) && (arcSide > 200) && (arcSide < 220)) {
        if (!isCaptured) {
          isCaptured = true;
          const dataUrl = canvas.toDataURL();
          button.style.display = 'inline-block';
          createImg(dataUrl);
        }
      }
    }
  }
};

new Stream(processFn);
