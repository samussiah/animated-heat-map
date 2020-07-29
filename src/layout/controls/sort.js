export default function sort() {
    const container = this.elements.controls
        .append('div')
        .classed('ahm-control ahm-control--sort', true);

    const inputs = container
        .selectAll('label')
        .data([
            {
                label: 'participant',
            },
            {
                label: 'result',
            },
        ])
        .join('label')
        .append('input')
        .attr('type', 'radio')
        .property('checked', (d) => d.label === this.settings.sort);

    // Add text _after_ radio button.
    inputs.each(function (d) {
        const text = document.createTextNode(`Sort by ${d.label}`);
        this.parentNode.appendChild(text);
    });

    inputs.on('change', (d) => {
        this.settings.sort = d.label;
        inputs.property('checked', (di) => di.label === this.settings.sort);
        const sortingFunction = (a, b) => {
            const aData = a.data ? a.data : a;
            const bData = b.data ? b.data : b;
            return this.settings.sort === 'participant'
                ? d3.ascending(aData.key, bData.key) //(a.data.key < b.data.key ? -1 : 1)
                : d3.ascending(aData.value, bData.value); //(a.data.value - b.data.value)
        };

        this.heatMap.arcAngles = d3
            .pie()
            .sort(null)
            .value((d, i) => 1)(this.heatMap.data.values.sort(sortingFunction));

        this.heatMap.iris
            .sort(sortingFunction)
            .data(this.heatMap.arcAngles, (d) => d.data.key)
            .transition()
            .duration(750)
            .ease(d3.easeElastic)
            .delay((d, i) => i * 20)
            .attr('d', this.heatMap.elements.arcGenerator);
    });

    return inputs;
}
