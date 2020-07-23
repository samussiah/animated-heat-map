export default function layout() {
    // Set dimensions.
    this.settings.width = this.elements.parent.node().clientWidth;
    this.settings.height = this.settings.width/16*9;

    // Add elements to DOM.
    this.elements.main = this.elements.parent
        .append('div')
        .classed('animated-heat-map', true);

    this.elements.svg = this.elements.main
        .append('svg')
        .classed('ahm-svg', true)
        .attr('width', this.settings.width)
        .attr('height', this.settings.height)
        .append('g')
        .attr('transform', 'translate(' + this.settings.width / 2 + ',' + this.settings.height / 2 + ')');
}
