export default function visit() {
    const group = d3
        .nest()
        .key((d) => d.visit + ':|:' + d.visit_order)
        .key((d) => d.id)
        .rollup((group) => group[0].result)
        .entries(this.data.clean)
        .map((d) => {
            const split = d.key.split(':|:');
            d.visit = split[0];
            d.visit_order = +split[1];

            return d;
        })
        .sort((a, b) => a.visit_order - b.visit_order);

    return group;
}
