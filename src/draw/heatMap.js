import callTextTransition from './heatMap/textTransition';
import transitionToNextVisit from './heatMap/transitionToNextVisit';

export default function heatMap(data, i) {
    const elements = i === undefined ? this.heatMap.elements : data.elements;

    const arcAngles = d3
        .pie()
        .sort(null)
        .value((d, i) => 1)(data.values.sort((a, b) => a.value - b.value));

    // draw arcs
    const iris = elements.g
        .append('g')
        .selectAll('path')
        .data(arcAngles, (d) => d.data.key) // pass arc
        .join('path')
        .classed('ahm-iris', true)
        .attr('d', elements.arcGenerator) // call arc generator
        .attr('fill', (d) => this.colorScale(d.data.value)) // color arcs by result
        .attr('stroke', (d) => this.colorScale(d.data.value)); // color arcs by result

    //const textTransition = callTextTransition.call(this, elements.visitText, data.visit);
    //const transition = transitionToNextVisit.call(this, iris, data.visit_order);

    elements.pupil.raise();

    elements.pupilText.raise();

    return {
        data,
        arcAngles,
        iris,
        //textTransition,
        //transition,
    };
}
