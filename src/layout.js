import controls from './layout/controls';
import legend from './layout/legend';
import heatMap from './layout/heatMap';
import resize from './layout/resize';

export default function layout() {
    // Set dimensions.
    this.settings.width = this.elements.parent.node().clientWidth;
    this.settings.height = (this.settings.width / 16) * 9;
    this.settings.minDimension = Math.min(this.settings.width, this.settings.height);
    this.settings.smallMultipleSize = this.settings.minDimension / 4;

    // container
    this.elements.main = this.elements.parent.append('div').classed('animated-heat-map', true);

    //controls
    this.elements.controls = this.elements.main.append('div').classed('ahm-controls', true).style('height', '40px');

    this.controls = controls.call(this);

    // legend
    this.elements.legend = this.elements.main.append('div').classed('ahm-legend', true);

    // main heat map
    this.elements.heatMap = this.elements.main
        .append('div')
        .classed('ahm-heat-map', true)
        .classed('ahm-hidden', this.settings.view !== 'heatMap');

    this.heatMap = {
        elements: Object.assign({ main: this.elements.heatMap }, heatMap.call(this)),
    };

    // small multiples
    this.elements.heatMaps = this.elements.main
        .append('div')
        .classed('ahm-heat-maps', true)
        .classed('ahm-hidden', this.settings.view !== 'heatMaps');

    this.heatMaps = {
        elements: {
            main: this.elements.heatMaps,
        },
    };

    window.addEventListener('resize', resize.bind(this));
}
