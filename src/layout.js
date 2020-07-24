import arcGenerator from './layout/arcGenerator';
import resize from './layout/resize';

export default function layout() {
    // Set dimensions.
    this.settings.width = this.elements.parent.node().clientWidth;
    this.settings.height = (this.settings.width / 16) * 9;
    this.settings.minDimension = Math.min(this.settings.width, this.settings.height);
    this.settings.smallMultipleSize = this.settings.minDimension / 4;

    // container
    this.elements.main = this.elements.parent.append('div').classed('animated-heat-map', true);

    // arc generator
    this.arcGenerator = arcGenerator.call(this);

    window.addEventListener('resize', resize.bind(this));
}
