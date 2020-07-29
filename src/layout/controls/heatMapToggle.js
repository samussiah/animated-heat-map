export default function heatMapToggle() {
    const container = this.elements.controls
        .append('div')
        .classed('ahm-control ahm-control--heat-map-toggle', true);

    const inputs = container
        .selectAll('label')
        .data([
            {
                prop: 'heatMap',
                class: 'ahm-heat-map',
                label: 'animated heat map',
            },
            {
                prop: 'heatMaps',
                class: 'ahm-heat-maps',
                label: 'heat maps by visit',
            },
        ])
        .join('label')
        .append('input')
        .attr('type', 'radio')
        .property('checked', (d) => d.prop === this.settings.view);

    // Add text _after_ radio button.
    inputs.each(function (d) {
        const text = document.createTextNode(`View ${d.label}`);
        this.parentNode.appendChild(text);
    });

    inputs.on('change', (d) => {
        this.settings.view = d.prop;
        inputs.property('checked', (di) => di.prop === this.settings.view);
        this.elements.heatMap.classed('ahm-hidden', this.settings.view !== 'heatMap');
        this.elements.heatMaps.classed('ahm-hidden', this.settings.view !== 'heatMaps');
    });

    return inputs;
}
