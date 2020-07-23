export default function draw() {
    this.colorScale = d3.scaleLinear()
        .domain(this.domain)
        .range([
            '#f7fbff',
            '#08306b',
        ]);

    // One arc per ID; constant arc length
    const arcAngles = d3.pie().sort(null).value((d,i) => 1)(this.data.nest);

    // calculates angles
    this.arcs = this.elements.g
        .selectAll('path')
        .data(arcAngles) // pass arc
        .join('path')
        .attr('fill', d => this.colorScale(d.data.value)) // color arcs by result
        .attr('d', this.arcGenerator) // call arc generator
        .attr('stroke', 'white')
        .style('stroke-width', '2px')
        .style('opacity', 0.7);
}
