import arcGenerator from './arcGenerator';

export default function resize() {
    this.settings.width = this.elements.parent.node().clientWidth;
    this.settings.height = (this.settings.width / 16) * 9;
    this.settings.minDimension = Math.min(this.settings.width, this.settings.height);
    this.arcGenerator = arcGenerator.call(this);

    this.heatMaps.forEach((heatMap) => {
        heatMap.svg.attr('width', this.settings.width).attr('height', this.settings.height);
        heatMap.g.attr(
            'transform',
            'translate(' + this.settings.width / 2 + ',' + this.settings.height / 2 + ')'
        );
        heatMap.iris.attr('d', this.arcGenerator);
        heatMap.pupil.attr('r', this.settings.minDimension / 8);
    });
}
