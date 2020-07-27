import arcGenerator from './arcGenerator';

export default function resize() {
    this.settings.width = this.elements.parent.node().clientWidth;
    this.settings.height = (this.settings.width / 16) * 9;
    this.settings.minDimension = Math.min(this.settings.width, this.settings.height);
    this.settings.smallMultipleSize = this.settings.minDimension / 4;
    this.arcGenerator = arcGenerator.call(this);

    this.heatMaps.forEach((heatMap) => {
        heatMap.svg
            .attr('width', this.settings.smallMultipleSize)
            .attr('height', this.settings.smallMultipleSize);
        heatMap.g.attr(
            'transform',
            'translate(' +
                this.settings.smallMultipleSize / 2 +
                ',' +
                this.settings.smallMultipleSize / 2 +
                ')'
        );
        heatMap.iris.attr('d', heatMap.arcGenerator.call(this));
        heatMap.pupil.attr('r', this.settings.smallMultipleSize / 8);
    });
}
