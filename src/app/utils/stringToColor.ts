import { clamp } from "lodash";

type ColorOutput = `rgb` | `hsl` | `hex`

export interface ColorSettings {
    output?: ColorOutput;
    saturation?: number;
    light?: number;
}

interface DefaultSettings {
    output: ColorOutput;
    saturation: number;
    light: number;
}

const defaultSettings: DefaultSettings = {
    output: `hex`,
    saturation: 50,
    light: 60,
};

const hue2rgb = function hue2rgb (p: number, q: number, t: number) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
};

function hslToHex (h: number, s: number, l: number) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color)
            .toString(16)
            .padStart(2, `0`); // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   {number}  h       The hue
 * @param   {number}  s       The saturation
 * @param   {number}  l       The lightness
 * @return  {Array}           The RGB representation
 */
function hslToRgb (h: number, s: number, l: number){
    let r, g, b;
    if (s === 0) r = g = b = l; // achromatic
    else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, 1)`;
}

export default (str: string, settings?: ColorSettings): string => {
    const colorSettings = {
        ...defaultSettings,
        ...settings,
    };
    const {
        saturation,
        light,
        output,
    } = colorSettings;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const h = Math.abs(hash) % 360;
    const s = clamp(saturation, 0, 100);
    const l = clamp(light, 0, 100);
    switch (output) {
    case `hex`: return hslToHex(h, s, l);
    case `hsl`: return `hsl(${h}, ${s}%, ${l}%)`;
    case `rgb`: return hslToRgb(h / 360, s / 100, l / 100);
    }
};
