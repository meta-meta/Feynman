const I2C = require('raspi-i2c').I2C;
const SH1107 = require('sh1107-js');
const PImage = require('pureimage');

async function render(sh1107, canvas, buffer) {
  for (let index = 0; index < canvas.height * canvas.width; index += 1) {
    const r = canvas.data[index * 4 + 0];
    buffer[index] = (r === 0 ? 0 : 1);
  }
  await sh1107.drawBitmap(buffer);
}

let ctx;
let sh1107;
let canvas;
let buffer;

async function init() {
  sh1107 = new SH1107({
    width: 128,
    height: 128,
    i2c: new I2C(),
    address: 0x3C,
  });

  await sh1107.initialize();
  sh1107.buffer.fill(0x00);
  await sh1107.update();

  // init pureimage
  canvas = PImage.make(128,128);

  // load font
  // Note: you can e.g. also load Font Awesome ttf to render icons
  // Note2: I tried loading multiple fonts but this doesn't seem to work
  var jetBrainsMono = PImage.registerFont('JetBrainsMono-Regular.ttf','JetBrainsMono');
  const fontLoaded = new Promise((resolve, reject) => {
    jetBrainsMono.load((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
  await fontLoaded;

  buffer = Buffer.alloc(canvas.width * canvas.height);
  ctx = canvas.getContext('2d');

  // draw stuff using familiar html5 canvas syntax
  ctx.fillStyle = '#000000';
  ctx.fillRect(0,0,128,128);
  ctx.fillStyle = '#FFFFFF';

  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle';
  ctx.font = "27pt 'JetBrainsMono'";
  ctx.fillText(`012345`, 63, 53);
  ctx.fillText(`6789૪Ɛ`, 63, 83);

  // render canvas to sh1107
  await render(sh1107, canvas, buffer);
}

module.exports = {
  clear: async (isImmediate = false) => {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0,0,128,128);
    if (isImmediate) await render(sh1107, canvas, buffer);
  },
  init,
  print: async (str, x = 0, y = 0, fontsize = 27) => {
    ctx.font = `${fontsize}pt 'JetBrainsMono'`;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(str, x + 63, y + 63);
    await render(sh1107, canvas, buffer);
  }
}
