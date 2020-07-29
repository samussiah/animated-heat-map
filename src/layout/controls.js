import heatMapToggle from './controls/heatMapToggle';
import sort from './controls/sort';

export default function controls() {
    const controls = {
        elements: {
            main: this.elements.controls,
        },
    };
    controls.heatMapToggle = heatMapToggle.call(this);
    controls.sort = sort.call(this);

    return controls;
}
