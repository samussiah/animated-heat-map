export default function visits() {
    const visits = this.containers.visits
        .selectAll('text')
        .data(this.data.groups.visit)
        .join('text')
        .attr('x', 0)
        .attr('y', (d, i) => i * 25)
        .attr('fill-opacity', (d, i) => 1 - i / 5)
        .attr('alignment-baseline', 'middle')
        .text((d) => d.visit);

    return visits;
}
