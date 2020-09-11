import arcGenerator from './heatMap/arcGenerator';

export default function heatMap(title = 'All Participants') {
    const container =
        title === 'All Participants'
            ? this.elements.heatMap
            : this.elements.heatMaps.append('div').classed('ahm-heat-map', true);
    const dimension =
        title === 'All Participants' ? this.settings.minDimension : this.settings.smallMultipleSize;

    // header
    const header = container.append('h3').classed('ahm-header', true).text(title);

    // svg
    const svg = container
        .append('svg')
        .classed('ahm-svg', true)
        .attr('width', dimension)
        .attr('height', dimension);

    // g
    const g = svg
        .append('g')
        .classed('ahm-g', true)
        .attr('transform', 'translate(' + dimension / 2 + ',' + dimension / 4 + ')'); // translate to center of SVG

    // draw visit text
    //const visitText = g
    //    .append('text')
    //    .classed('ahm-visit-text', true)
    //    .attr('x', -dimension / 2)
    //    .attr('y', 0)
    //    .attr('dominant-baseline', 'hanging')
    //    .text(title);
    const visitText = g
        .append('g')
        .classed('ahm-visit-text', true)
        .attr('transform', 'translate(' + -dimension / 2 + ',' + 0 + ')'); // translate to center of SVG
    visitText
        .append('rect')
        .attr('x', 0)
        .attr('width', dimension / 4)
        .attr('y', -12)
        .attr('height', 22)
        .attr('fill', '#aaa');

    // draw pupil
    const pupil = g
        .append('circle')
        .classed('ahm-pupil', true)
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', dimension / 16)
        .attr('fill', 'black')
        .attr('stroke', 'black')
        .attr('stroke-width', '5px')
        .attr('stroke-opacity', 0.25);
    const pupilText = g
        .append('text')
        .attr('x', 0)
        .attr('y', 0)
        .attr('fill', 'white')
        .attr('stroke', 'white')
        .attr('text-anchor', 'middle')
        .text('95% with fluid');
    console.log(pupilText);

    return {
        header,
        svg,
        g,
        visitText,
        pupil,
        pupilText,
        arcGenerator: arcGenerator.call(this, dimension / 2),
    };
}
