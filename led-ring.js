function HSVtoHex(h, s, v) {
  function rgbToHex({ r, g, b }) {
    function componentToHex(c) {
      var hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }



      return r << 16 | g << 8 | b;


    //return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

  var r, g, b, i, f, p, q, t;
  if (arguments.length === 1) {
    s = h.s;
    v = h.v;
    h = h.h;
  }
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: {
      r = v;
      g = t;
      b = p;
      break;
    }
    case 1: {
      r = q;
      g = v;
      b = p;
      break;
    }
    case 2: {
      r = p;
      g = v;
      b = t;
      break;
    }
    case 3: {
      r = p;
      g = q;
      b = v;
      break;
    }
    case 4: {
      r = t;
      g = p;
      b = v;
      break;
    }
    case 5: {
      r = v;
      g = p;
      b = q;
      break;
    }
  }
  return rgbToHex({
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  });
}

const ws281x = require('rpi-ws281x-native');

const channel = ws281x(12, {
    stripType: 'ws2812',
    gpio: 18,
});



const colorArray = channel.array;
let t = 0;

const setLeds = (colors) => {
    colors.forEach((c, i) => {
	channel.array[i] = c;
    });

    ws281x.render();
};


// setInterval(() => {
//     setLeds([0,1,2,3,4,5,6,7,8,9,10,11]
// 	    .map(i => HSVtoHex(((i + 9) % 12) / 12, 1, t % 12 == i ? 0.1 : 0.01)));
//     t++;
// }, 100);

module.exports = {
  setLed: (i, h, s, v) => {
    channel.array[i] = HSVtoHex(h, s, v);
    ws281x.render();
  },
}
