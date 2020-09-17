import getDimensions from './layout/getDimensions';
import controls from './layout/controls';
import heatMap from './layout/heatMap';
//import resize from './layout/resize';

export default function layout() {
    const containers = {
        main: d3.select(this.element).append('div').classed('animated-heat-map', true),
    };

    getDimensions.call(this, containers);

    containers.controls = this.util.addElement('controls', containers.main);
    containers.legend = this.util.addElement('legend', containers.main);
    containers.heatMap = this.util.addElement('heat-map', containers.main);
    containers.svg = this.util.addElement('svg', containers.heatMap, 'svg')
        .attr('width', this.settings.width)
        .attr('height', this.settings.height);
    containers.g = this.util.addElement('g', containers.svg, 'g')
        .attr('transform', `translate(${this.settings.width/2},${this.settings.radius})`);
    containers.visits = this.util.addElement('visits', containers.g, 'g')
        .attr('transform', `translate(-${this.settings.width/2},0)`);
    containers.visitBackground = this.util.addElement('visit-background', containers.visits, 'rect')
        .attr('x', 0)
        .attr('width', this.settings.width/2)
        .attr('y', '-12')
        .attr('height', 22)
        .attr('fill', '#aaa');
    containers.iris = this.util.addElement('iris', containers.g, 'g');
    containers.pupil = this.util.addElement('pupil', containers.g, 'circle')
        .attr('r', this.settings.innerRadius);
    containers.annotation = this.util.addElement('annotation', containers.g, 'text')
        .attr('fill', 'white')
        .attr('stoke', 'white')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle');
    containers.annotation1 = this.util.addElement('annotation__1', containers.annotation, 'tspan')
        .attr('x', 0)
        .attr('y', -12);
    containers.annotation2 = this.util.addElement('annotation__2', containers.annotation, 'tspan')
        .attr('x', 0)
        .attr('y', 12)
        .text('Baseline');

    //window.addEventListener('resize', resize.bind(this));

    return containers;
}
