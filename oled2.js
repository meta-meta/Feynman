const I2C = require('raspi-i2c').I2C;
const SH1107 = require('sh1107-js');
const PImage = require('pureimage');
const Buffer = require('buffer');

async function render(sh1107, canvas, buffer) {
  for (let index = 0; index < canvas.height * canvas.width; index += 1) {
    const r = canvas.data[index * 4 + 0];
    buffer[index] = (r === 0 ? 0 : 1);
  }
  await sh1107.drawBitmap(buffer);
}

async function main() {
  const sh1107 = new SH1107({
    width: 128,
    height: 128,
    i2c: new I2C(),
    address: 0x3C,
  });

  await sh1107.initialize();
  sh1107.buffer.fill(0x00);
  await sh1107.update();

  // init pureimage
  const canvas = PImage.make(128,128);

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

  const buffer = Buffer.alloc(canvas.width * canvas.height);
  const ctx = canvas.getContext('2d');

  // draw stuff using familiar html5 canvas syntax
  ctx.font = "12pt 'JetBrainsMono'";
  ctx.fillStyle = '#000000';
  ctx.fillRect(0,0,128,128);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(`hello world!`, 0, 95);

  // render canvas to sh1107
  await render(sh1107, canvas, buffer);
}

main();
