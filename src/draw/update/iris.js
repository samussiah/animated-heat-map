export default function iris() {
    this.heatMap.iris
        .transition()
        .ease(d3.easeLinear)
        .duration(this.settings.duration)
        .attr('fill', (d) => {
            const idDatum = this.data.id.find((di) => di.id === d.data.key);
            return this.colorScale(idDatum.result);
        })
        .attr('stroke', (d) => {
            const idDatum = this.data.id.find((di) => di.id === d.data.key);
            return this.colorScale(idDatum.result);
        });
}
