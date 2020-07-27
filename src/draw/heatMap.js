import callTextTransition from './heatMap/textTransition';
import transitionToNextVisit from './heatMap/transitionToNextVisit';

export default function heatMap(data, i) {
    const elements = i === undefined ? this.heatMap.elements : data.elements;

    const arcAngles = d3
        .pie()
        .sort(null)
        .value((d, i) => 1)(data.values);

    // draw arcs
    const iris = elements.g
        .selectAll('path')
        .data(arcAngles) // pass arc
        .join('path')
        .classed('ahm-iris', true)
        .attr('d', elements.arcGenerator) // call arc generator
        .attr('fill', (d) => this.colorScale(d.data.value)); // color arcs by result
    //.attr('stroke', 'white')
    //.attr('stroke-width', '.5px');

    const textTransition = callTextTransition.call(this, elements.visitText, data.visit);
    const transition = transitionToNextVisit.call(this, iris, data.visit_order);

    elements.pupil.raise();

    return {
        data,
        arcAngles,
        iris,
        textTransition,
        transition,
    };
}
