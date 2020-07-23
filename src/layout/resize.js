import arcGenerator from './arcGenerator';

export default function resize() {
    this.settings.width = this.elements.parent.node().clientWidth;
    this.settings.height = this.settings.width/16*9;
    this.settings.minDimension = Math.min(this.settings.width, this.settings.height);

    this.elements.svg
        .attr('width', this.settings.width)
        .attr('height', this.settings.height)
    this.elements.g
        .attr('transform', 'translate(' + this.settings.width / 2 + ',' + this.settings.height / 2 + ')');
    this.arcGenerator = arcGenerator.call(this);
    this.arcs
        .attr('d', this.arcGenerator)
}
