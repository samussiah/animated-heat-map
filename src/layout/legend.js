export default function legend() {
    const legendDimensions = [200, 50];

    // container
    const container = this.elements.main.append('div').classed('ahm-legend', true);

    //// label
    //const label = container
    //    .append('div')
    //    .classed('ahm-legend__label', true)
    //    .style('width', legendDimensions[0] + 'px')
    //    .text(this.settings.measure);

    //// svg
    //const svg = container
    //    .append('svg')
    //    .attr('width', legendDimensions[0])
    //    .attr('height', legendDimensions[1])
    //    .append('g');

    //// marks
    //const marks = svg
    //    .selectAll('rect.legend-mark')
    //    .data(this.settings.colors())
    //    .enter()
    //    .append('rect')
    //    .classed('legend-mark', true)
    //    .attr('x', (d, i) => i * (legendDimensions[0] / this.settings.colors().length))
    //    .attr('y', 0)
    //    .attr('width', legendDimensions[0] / this.settings.colors().length)
    //    .attr('height', legendDimensions[1] / 2)
    //    .attr('fill', (d) => d)
    //    .attr('fill-opacity', 0.5)
    //    .attr('stroke', (d) => d)
    //    .attr('stroke-opacity', 1);

    //// lower end of scale
    //const lower = svg
    //    .append('text')
    //    .attr('x', legendDimensions[0] / this.settings.colors().length / 2)
    //    .attr('y', legendDimensions[1] / 2 + 16)
    //    .attr('text-anchor', 'middle')
    //    .text('0');

    //// upper end of scale
    //const upper = svg
    //    .append('text')
    //    .attr('x', legendDimensions[0] - legendDimensions[0] / this.settings.colors().length / 2)
    //    .attr('y', legendDimensions[1] / 2 + 16)
    //    .attr('text-anchor', 'middle')
    //    .text(`${this.settings.colors().length-1}+`);

    return {
        container,
        //label,
        //svg,
        //marks,
        //lower,
        //upper
    };
}
