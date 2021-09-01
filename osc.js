const OSC = require('osc-js')

// https://github.com/adzialocha/osc-js/wiki/UDP-Plugin

const options = {
    open: { host: '0.0.0.0', port: 9000 },
    send: { host: '192.168.1.15',  port: 9001 } };

const osc = new OSC({ plugin: new OSC.DatagramPlugin(options) })

osc.on('/test', message => {
    console.log(message.args)
})

osc.on('open', () => {
    console.log('open');
    setInterval(() => {
	console.log('send');
	osc.send(new OSC.Message('/response', Math.random()))
    }, 1000)
})

console.log('opening')

osc.open(options) // bind socket to localhost:9000
