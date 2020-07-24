import arcGenerator from './heatMap/arcGenerator';

export default function heatMap(data) {
    // div
    const div = this.elements.main
        .append('div')
        .classed('ahm-heat-map', true)
        .style('display', 'inline-block');

    // header
    const header = div.append('h3').classed('ahm-header', true).text(`Visit ${data.key}`);

    // svg
    const svg = div
        .append('svg')
        .classed('ahm-svg', true)
        .attr('width', this.settings.smallMultipleSize)
        .attr('height', this.settings.smallMultipleSize);

    // g
    const g = svg
        .append('g')
        .classed('ahm-g', true)
        .attr(
            'transform',
            'translate(' +
                this.settings.smallMultipleSize / 2 +
                ',' +
                this.settings.smallMultipleSize / 2 +
                ')'
        ); // translate to center of SVG

    // One arc per ID; constant arc length
    const shell = this.data.nest.map((d) => {
        const datum = data.values.find((di) => di.key === d.key);
        return datum
            ? datum
            : {
                  key: d.key,
                  value: null,
              };
    });
    const arcAngles = d3
        .pie()
        .sort(null)
        .value((d, i) => 1)(shell);

    // draw arcs
    const iris = g
        .selectAll('path')
        .data(arcAngles) // pass arc
        .join('path')
        .classed('ahm-iris', true)
        .attr('d', arcGenerator.call(this)) // call arc generator
        .attr('fill', (d) => this.colorScale(d.data.value)); // color arcs by result
    //.attr('stroke', 'white')
    //.attr('stroke-width', '.5px');

    // draw pupil
    const pupil = g
        .append('circle')
        .classed('ahm-pupil', true)
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', this.settings.smallMultipleSize / 8)
        .attr('fill', 'black')
        .attr('stroke', 'black')
        .attr('stroke-width', '5px')
        .attr('stroke-opacity', 0.25);

    return {
        data,
        svg,
        g,
        arcAngles,
        iris,
        pupil,
    };
}
