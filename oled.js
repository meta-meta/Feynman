const I2C = require('raspi-i2c').I2C;
const SH1107 = require('sh1107-js');

async function main () {
  const sh1107 = new SH1107({
    width: 128,
    height: 128,
    i2c: new I2C(),
    address: 0x3C
  });
  await sh1107.initialize();

  // paint it black
  sh1107.buffer.fill(0x00);
  await sh1107.update();

  //await sh1107.fillRect(17,75,100,10,'WHITE');

  //await sh1107.writeString(17, 75, font, 'ROBOTS ARE HERE', 'BLACK');
   await sh1107.drawCircle(64, 63, 63, 'WHITE');
    //sh1107.drawCircle(64, 64, 16, 'WHITE');
}


main().catch(err => {
    console.log(err);
});
