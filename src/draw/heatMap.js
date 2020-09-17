//import callTextTransition from './heatMap/textTransition';
//import transitionToNextVisit from './heatMap/transitionToNextVisit';

export default function heatMap(data, i) {
    const pie = d3
        .pie()
        .sort(null)
        .value((d, i) => 1);

    const pieData = pie(data.values.sort((a, b) => a.value - b.value));

    const iris = this.containers.iris
        .selectAll('path')
        .data(pieData, (d) => d.data.key) // pass arc
        .join('path')
        .classed('ahm-iris', true)
        .attr('d', this.arcGenerator) // call arc generator
        .attr('fill', (d) => this.colorScale(d.data.value)) // color arcs by result
        .attr('stroke', (d) => this.colorScale(d.data.value)); // color arcs by result

    this.containers.pupil.raise();
    this.containers.annotation.raise();

    return {
        data,
        pie,
        pieData,
        iris,
    };
}
