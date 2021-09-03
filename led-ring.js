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

const _setLed = (i, color) => {
  channel.array[(i + 3) % 12] = color;
};

const colors = [];

module.exports = {
  addLed: (i, h, s, v) => {
    _setLed(i, colors[i] + HSVtoHex(h, s, v));
  },
  setLed: (i, h, s, v) => {
    const color = HSVtoHex(h, s, v);
    colors[i] = color;
    _setLed(i, color);
  },
  render: () => {
    ws281x.render();
  },

}
