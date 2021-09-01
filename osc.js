const oled = require('./oled2');
const OSC = require('osc-js');

oled.init().then(() => console.log('oled initialized'));

// https://github.com/adzialocha/osc-js/wiki/UDP-Plugin

const options = {
  open: {host: '0.0.0.0', port: 9000},
  send: {host: '192.168.1.15', port: 9001}
};

const osc = new OSC({plugin: new OSC.DatagramPlugin(options)})

osc.on('/oled/clear', message => {
  console.log('/oled/clear');
  oled.clear();
});

osc.on('/oled/print', message => {
  console.log('/oled/print', message.args);
  oled.print(...message.args);
});

osc.on('open', () => {
  console.log('OSC opened');
  setInterval(() => {
    osc.send(new OSC.Message('/response', Math.random()))
  }, 1000)
})

console.log('opening OSC')

osc.open(options) // bind socket to localhost:9000
