import defaults from './settings';
import util from './util/index';
import layout from './layout';
import dataManipulation from './data';
import draw from './draw';

export default function animatedHeatMap(data, element = 'body', settings = {}) {
    const main = {
        data,
        element,
        settings: Object.assign(defaults(), settings),
        util,
    };

    main.containers = layout.call(main); // add elements to DOM
    dataManipulation.call(main); // mutate and structure data
    draw.call(main); // run the animation

    return main;
}
