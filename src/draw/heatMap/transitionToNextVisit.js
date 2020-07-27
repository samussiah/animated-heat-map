export default function transitionToNextVisit(iris, visit_order) {
    const transition = iris
        .transition()
        //.delay(2000)
        .duration(2000)
        .attr('fill', (d) => {
            const idData = this.data.nest.find((di) => di.key === d.data.key);
            const visitDatum = idData.values.find((di) => di.visit_order === visit_order);

            if (visitDatum !== undefined) return this.colorScale(visitDatum.result);
            else return this.colorScale(d.data.value);
        });

    return transition;
}
