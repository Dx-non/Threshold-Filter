const fileInput = document.getElementById('fileInput');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const thresholdRange = document.getElementById('thresholdRange');
const levelValue = document.getElementById('levelValue');
const applyBtn = document.getElementById('applyBtn');

let img = new Image();
let imageDataOriginal = null;

fileInput.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  img.src = URL.createObjectURL(file);
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    canvas.style.display = 'block';
    imageDataOriginal = ctx.getImageData(0, 0, canvas.width, canvas.height);
  };
});

thresholdRange.addEventListener('input', e => {
  levelValue.textContent = e.target.value;
  applyThreshold(parseInt(e.target.value));
});

applyBtn.addEventListener('click', () => {
  const level = parseInt(thresholdRange.value);
  applyThreshold(level);
});

function applyThreshold(level) {
  if (!imageDataOriginal) return;
  const imageData = new ImageData(
    new Uint8ClampedArray(imageDataOriginal.data),
    canvas.width,
    canvas.height
  );
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i+1] + data[i+2]) / 3;
    const value = avg < level ? 0 : 255;
    data[i] = data[i+1] = data[i+2] = value;
  }
  ctx.putImageData(imageData, 0, 0);
}