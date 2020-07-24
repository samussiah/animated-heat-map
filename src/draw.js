import heatMap from './draw/heatMap';

export default function draw() {
    this.colorScale = d3.scaleLinear().domain(this.domain).range(['#f7fbff', '#08306b']);

    this.heatMaps = this.data.byVisit.map((visit) => heatMap.call(this, visit));
}
