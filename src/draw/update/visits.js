export default function visits() {
    this.visits
        .transition()
        .duration(this.settings.duration)
        .attr('y', (d,i) => i*25 - this.visitIndex*25)
        .attr('fill-opacity', (d,i) => 1 - Math.abs(this.visitIndex - i) / 5);
}
