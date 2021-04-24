export default function createImg(data) {
  const img = document.createElement('img');
  img.src = data;
  img.style.transform = 'scale(-1, 1)';
  document.body.append(img);
}
