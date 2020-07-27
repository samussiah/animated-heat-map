import arcGenerator from '../layout/heatMap/arcGenerator';

export default function resize() {
    // Update dimensions.
    this.settings.width = this.elements.parent.node().clientWidth;
    this.settings.height = (this.settings.width / 16) * 9;
    this.settings.minDimension = Math.min(this.settings.width, this.settings.height);
    this.settings.smallMultipleSize = this.settings.minDimension / 4;

    // Update main heat map.
    this.heatMap.elements.svg
        .attr('width', this.settings.minDimension)
        .attr('height', this.settings.minDimension);
    this.heatMap.elements.g.attr(
        'transform',
        'translate(' + this.settings.minDimension / 2 + ',' + this.settings.minDimension / 2 + ')'
    );
    this.heatMap.elements.visitText
        .attr('x', -this.settings.minDimension / 2)
        .attr('y', -this.settings.minDimension / 2);
    this.heatMap.iris.attr('d', arcGenerator.call(this, this.settings.minDimension));
    this.heatMap.elements.pupil.attr('r', this.settings.minDimension / 8);

    // Update small multiples.
    this.heatMaps.forEach((heatMap) => {
        heatMap.elements.svg
            .attr('width', this.settings.smallMultipleSize)
            .attr('height', this.settings.smallMultipleSize);
        heatMap.elements.g.attr(
            'transform',
            'translate(' +
                this.settings.smallMultipleSize / 2 +
                ',' +
                this.settings.smallMultipleSize / 2 +
                ')'
        );
        heatMap.elements.visitText
            .attr('x', -this.settings.minDimension / 2)
            .attr('y', -this.settings.minDimension / 2);
        heatMap.iris.attr('d', arcGenerator.call(this, this.settings.smallMultipleSize));
        heatMap.elements.pupil.attr('r', this.settings.smallMultipleSize / 8);
    });
}
