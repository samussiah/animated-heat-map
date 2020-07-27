import defaultSettings from './settings';
import dataManipulation from './data';
import layout from './layout';
import draw from './draw';

// TODO: animate by visit or timepoint
export default function animatedHeatMap(data, element = 'body', settings = {}) {
    const ahm = {
        data,
        elements: {
            parent: d3.select(element),
        },
        settings: Object.assign(defaultSettings(), settings),
    };

    layout.call(ahm);
    dataManipulation.call(ahm);
    draw.call(ahm);

    return ahm;
}
