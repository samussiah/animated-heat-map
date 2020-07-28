export default function play() {
    const container = this.elements.controls
        .append('div')
        .classed('ahm-control ahm-control--play', true);

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
        .property('checked', (d) => d.label === this.settings.play);

    // Add text _after_ radio button.
    inputs.each(function (d) {
        const text = document.createTextNode(`play by ${d.label}`);
        this.parentNode.appendChild(text);
    });

    inputs.on('change', (d) => {
        this.settings.play = d.label;
        inputs.property('checked', (di) => di.label === this.settings.play);
        const playingFunction = (a,b) => {
            const aData = a.data ? a.data : a;
            const bData = b.data ? b.data : b;
            return this.settings.play === 'participant'
                ? d3.ascending(aData.key, bData.key)//(a.data.key < b.data.key ? -1 : 1)
                : d3.ascending(aData.value, bData.value);//(a.data.value - b.data.value)
        };

        this.heatMap.arcAngles = d3
            .pie()
            .play(null)
            .value((d, i) => 1)(this.heatMap.data.values.play(playingFunction));

        this.heatMap.iris
            .play(playingFunction)
            .data(this.heatMap.arcAngles, d => d.data.key)
            .transition()
            .duration(750)
            .delay((d,i) => i*20)
            .attr('d', this.heatMap.elements.arcGenerator);
    });

    return inputs;
}
