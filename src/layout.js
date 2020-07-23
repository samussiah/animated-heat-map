import arcGenerator from './layout/arcGenerator';
import resize from './layout/resize';

export default function layout() {
    // Set dimensions.
    this.settings.width = this.elements.parent.node().clientWidth;
    this.settings.height = this.settings.width/16*9;
    this.settings.minDimension = Math.min(this.settings.width, this.settings.height);

    // container
    this.elements.main = this.elements.parent
        .append('div')
        .classed('animated-heat-map', true);

    // svg
    this.elements.svg = this.elements.main
        .append('svg')
        .classed('ahm-svg', true)
        .attr('width', this.settings.width)
        .attr('height', this.settings.height);

    // g
    this.elements.g = this.elements.svg
        .append('g')
        .attr('transform', 'translate(' + this.settings.width / 2 + ',' + this.settings.height / 2 + ')'); // translate to center of SVG

    // arc
    this.arcGenerator = arcGenerator.call(this);

    window.addEventListener('resize', resize.bind(this));
}
