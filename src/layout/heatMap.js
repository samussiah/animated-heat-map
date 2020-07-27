import arcGenerator from './heatMap/arcGenerator';

export default function heatMap(title = 'All Participants') {
    const dimension =
        title === 'All Participants' ? this.settings.minDimension : this.settings.smallMultipleSize;

    // div
    const div = this.elements.main
        .append('div')
        .classed('ahm-heat-map', true)
        .style('display', 'inline-block');

    // header
    const header = div.append('h3').classed('ahm-header', true).text(title);

    // svg
    const svg = div
        .append('svg')
        .classed('ahm-svg', true)
        .attr('width', dimension)
        .attr('height', dimension);

    // g
    const g = svg
        .append('g')
        .classed('ahm-g', true)
        .attr('transform', 'translate(' + dimension / 2 + ',' + dimension / 2 + ')'); // translate to center of SVG

    // draw visit text
    const visitText = g
        .append('text')
        .classed('ahm-visit-text', true)
        .attr('x', -dimension / 2)
        .attr('y', -dimension / 2)
        .attr('dominant-baseline', 'hanging')
        .text(title);

    // draw pupil
    const pupil = g
        .append('circle')
        .classed('ahm-pupil', true)
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', dimension / 8)
        .attr('fill', 'black')
        .attr('stroke', 'black')
        .attr('stroke-width', '5px')
        .attr('stroke-opacity', 0.25);

    return {
        div,
        header,
        svg,
        g,
        visitText,
        pupil,
        arcGenerator: arcGenerator.call(this, dimension),
    };
}
