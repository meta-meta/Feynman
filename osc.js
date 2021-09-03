const _ = require('lodash');
const ledRing = require('./led-ring');
const oled = require('./oled2');
const OSC = require('osc-js');

oled.init().then(() => console.log('oled initialized'));

// https://github.com/adzialocha/osc-js/wiki/UDP-Plugin

const options = {
  open: {host: '0.0.0.0', port: 9000},
  send: {host: '192.168.1.15', port: 9001}
};

const osc = new OSC({plugin: new OSC.DatagramPlugin(options)})

osc.on('/oled/clear', ({ args: [isImmediate]}) => {
  console.log('/oled/clear', isImmediate);
  oled.clear(isImmediate);
});

osc.on('/oled/print', ({ args: [str, x, y, fontSize] }) => {
  console.log('/oled/print', str, x, y, fontSize);
  oled.print(str, x, y, fontSize);
});


osc.on('/led/set', ({ args }) => {
  _.chunk(args, 4).forEach(([i, h, s, v]) => {
    // console.log('/led/set', i, h, s, v);
    ledRing.setLed(i, h, s, v)
  })
});

osc.on('open', () => {
  console.log('OSC opened');
  setInterval(() => {
    osc.send(new OSC.Message('/response', Math.random()))
  }, 1000)
})

console.log('opening OSC')

osc.open(options) // bind socket to localhost:9000
