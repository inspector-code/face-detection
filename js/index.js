import Stream from './Stream.js';
import Pico from './Pico.js';
import FaceDetector from './FaceDetector.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const parentNode = document.getElementById('face-detector');
const cascadeUrl = 'https://raw.githubusercontent.com/nenadmarkus/pico/c2e81f9d23cc11d1a612fd21e4f9de0921a5d0d9/rnt/cascades/facefinder';
const pico = new Pico(ctx, cascadeUrl);
const faceDetector = new FaceDetector(canvas, parentNode, ctx);

new Stream(ctx, parentNode, faceDetector, pico).startStream();
